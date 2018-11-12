const Metalsmith = require('metalsmith');
const path = require('path');
const consolidate = require('consolidate');
const async = require('async');
const fs = require('fs');

const fileName = require('../../utils/fileName');
const template = require('../../utils/template');
const config = require('../config');
const fileOperates = require('../../utils/fileOperates');

const copyTemplate = (componentName, author) => {
  const params = {
    PureName: fileName.getPureComponentName(componentName),
    ComponentName: fileName.getComponentName(componentName),
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

  const templatePackagePath = template.getTemplatePackagePath();
  const templatePath = path.join(templatePackagePath, config.componentPath, config.defaultComponentTemplateName);
  const destPath = path.resolve(process.cwd(), config.componentDestPath, params.ComponentName);

  const metalsmith = Metalsmith(templatePath);
  const metadata = metalsmith.metadata();
  
  metadata.PureName = params.PureName;
  metadata.ComponentName =params.ComponentName;
  metadata.HyphenComponentName = params.HyphenComponentName;
  metadata.author = params.author;

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

  fileOperates.replaceText(files, data, {
    [config.defaultComponentTemplateName]: data.ComponentName,
  }, callback);
}

module.exports = copyTemplate;
