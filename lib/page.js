var path = require('path')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')
var consolidate = require('consolidate')

var ask = require('../util/ask')
var config = require('../util/config').getConfig()
var moduleModeConfig = config.getBasicConfig('module')

var pageModeConfig = config.getBasicConfig('page')
var updateAttachedContent = require('./updateAttachedContent')
var fileName = require('../util/fileName')

function run (moduleName, pageName) {
  var to = path.join(moduleModeConfig.destBasePath, fileName.getHeadUpper(pageName));

  var metalsmith = Metalsmith(moduleModeConfig.templatePath)
  var metadata = metalsmith.metadata()
  metadata.pageNameUpper = fileName.getHeadUpper(pageName);
  metadata.pageNameLower = fileName.getHeadLower(pageName);
  metadata.route = fileName.getFullLower(moduleName);
  metadata.moduleName = moduleName;

  var prompts = [{
    key: 'pageNavChineseName',
    type: 'input',
    message: 'Plesae enter page Chinese name for the navigation：',
  }]

  metalsmith.clean(false)
    .use(ask(prompts))
    .use(updateContent)
    .source('.')
    .destination(to)
    .build((err, files) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Finish copy')
        updateAttachedContent('page', metadata)
      }
    })
}

function updateContent(files, metalsmith, callback){
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  async.each(keys, run, callback);

  function run(file, callback){
    var str = files[file].contents.toString();
    consolidate.ejs.render(str, metadata, function(err, res){
      if (err) {
        console.log('wrong', file, err);
        return callback(err);
      }
      console.log('success', file);
      files[file].contents = new Buffer(res);
      callback();
    });
  }
}

module.exports = run;
