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

module.exports = Template;
