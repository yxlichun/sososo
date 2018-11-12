const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../lib/config');

const Template = {};

Template.getTemplatePackagePath = function() {
  const testPath = [
    path.resolve(__dirname, '../node_modules', config.templatePackage),
    path.resolve(__dirname, '../../', config.templatePackage),
  ]
  try {
    fs.accessSync(testPath[0],fs.constants.F_OK);
    return testPath[0];
  } catch(ex) {
    try {
      fs.accessSync(testPath[1],fs.constants.F_OK);
      return testPath[1];
    } catch(ex) {
      console.log(chalk.red('can not find the template package, please make sure ...'));
      return null;
    }
  }
};

Template.checkTemplateVersion = function() {
  const templatePath = Template.getTemplatePackagePath();
  if (templatePath) {
    const file = fs.readFileSync(path.join(templatePath, 'package.json'));
    const templateFeature = JSON.parse(file);

    console.log(chalk.yellow('The template version is ' + templateFeature.version));
    console.log();
  }
  return templatePath;
}

Template.getTemplateInfo = function(packagePath, subPath) {
  packagePath = packagePath || Template.getTemplatePackagePath();
  return {
    templates: getTemplateFolds(packagePath, subPath),
    packagePath: packagePath,
  }
}

function getTemplateFolds(packagePath, subPath) {
  const arr = [];
  const templatePath = path.join(packagePath, subPath);
  const files = fs.readdirSync(templatePath);

  files.forEach(function (item, index) {
      const stat = fs.lstatSync(path.join(templatePath, item));
      if (stat.isDirectory() === true) { 
        arr.push(item)
      }
  });

  return arr;
}

module.exports = Template;
