const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars')
const path = require('path');
const consolidate = require('consolidate');
const async = require('async');
const fs = require('fs');

const fileName = require('../../utils/fileName');
const template = require('../../utils/template');
const Utils = require('../../utils/utils');
const config = require('../config');
const fileOperates = require('../../utils/fileOperates');

const copyTemplate = (componentName, author) => {
  const params = {
    PureName: fileName.getPureComponentName(componentName),
    ComponentName: fileName.getHeadUpper(componentName),
    HyphenComponentName: fileName.getHyphenComponentName(componentName),
    author
  }
  return Promise.all([
    copyPackage(params),
    // copyTest(params),
  ])
}

const copyPackage = (params) => {
  const pureName = params.PureName;

  const templatePackagePath = template.checkTemplateVersion();
  const templatePath = path.join(templatePackagePath, config.componentPath, config.defaultComponentTemplateName);
  const destPath = path.resolve(process.cwd(), config.componentDestPath, params.ComponentName);

  const metalsmith = Metalsmith(templatePath);
  const metadata = metalsmith.metadata();
  
  metadata.PureName = params.PureName;
  metadata.ComponentName =params.ComponentName;
  metadata.HyphenComponentName = params.HyphenComponentName;
  metadata.author = params.author.split(' ')[0];
  metadata.date = Utils.formatDate(new Date());
  const p = function(resolve, reject) {
    metalsmith.clean(false)
    .use(filter)
    .use(updateContent)
    .source('.')
    .destination(destPath) 
    .build((err, files) => {
      if (err) {
        reject(err);
      } else {
        console.log('Finish copy');
        resolve(true);
      }
    })
  }
  return new Promise(p);
}

const filter = (files, metalsmith, callback) => {
  fileOperates.filter(files);
  callback();
}

const updateContent = (files, metalsmith, callback) => {
  const data = metalsmith.metadata();
  // 加注释
  const fileName = 'index.js';
  const fileContentsString = files[fileName].contents.toString(); //Handlebar compile 前需要转换为字符串
  files[fileName].contents = new Buffer(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
  fileOperates.replaceText(files, data, {
    [config.defaultComponentTemplateName]: data.ComponentName,
  }, callback);
}

module.exports = copyTemplate;
