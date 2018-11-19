var path = require('path')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
var async = require('async')
var consolidate = require('consolidate')

var ask = require('../../utils/ask')
var config = require('../config');
var updateAttachedContent = require('./updateAttachedContent')
var fileName = require('../../utils/fileName')
const Utils = require('../../utils/utils');

function run ({ template, packagePath }, moduleName, pageName, author, parent) {
  var to =path.resolve(process.cwd(), config.pageDestPath, fileName.getHeadUpper(pageName));
  
  var metalsmith = Metalsmith(path.join(packagePath, '/src/containers', template));
  var metadata = metalsmith.metadata();
  metadata.author = author.split(' ')[0];
  metadata.date = Utils.formatDate(new Date());
  metadata.moduleName = parent;

  if (moduleName) {
    metadata.moduleName = fileName.getHeadLower(moduleName);;
  }
  metadata.pageNameUpper = fileName.getHeadUpper(pageName);
  metadata.pageNameLower = fileName.getHeadLower(pageName);
  metadata.template = template;

  var prompts = [{
    key: 'pageNavChineseName',
    type: 'input',
    message: 'Plesae enter page Chinese name for the navigation：',
  }]

  metalsmith.clean(false)
    .use(ask(prompts))
    .use(filter)
    .use(updateContent)
    .source('.')
    .destination(to)
    .build((err, files) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Finish copy')
        if (metadata.moduleName) {
          updateAttachedContent('page', metadata)
        } else {
          updateAttachedContent('module', metadata)
        }
      }
    })
}

function filter(files, metalsmith, callback) {
  var filter = ['.DS_Store'];
  delete files[filter[0]];
  callback()
}

function updateContent(files, metalsmith, callback){
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();
  // 加注释
  const fileName = 'index.js';
  const fileContentsString = files[fileName].contents.toString(); //Handlebar compile 前需要转换为字符串
  files[fileName].contents = new Buffer(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
  async.each(keys, run, callback);

  function run(file, callback){
    var str = files[file].contents.toString();
    consolidate.ejs.render(str, metadata, function(err, res){
      if (err) {
        console.log('wrong', file, err);
        return callback(err);
      }
      console.log('success', file);
      res = res.replace(new RegExp(metadata.template, 'g'), metadata.pageNameUpper);
      files[file].contents = new Buffer(res);
      callback();
    });
  }
}

module.exports = run;
