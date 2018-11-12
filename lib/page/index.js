const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs');
const path = require('path');

const config = require('../config');
const runGeneratePage = require('./page');
const Templates = require('./templates');

function generatePage(pageName) {
  Templates.checkTemplateVersion()
  .then(Templates.getTemplatesInfo)
  .then(({ templates, packagePath }) => {
    inquirer.prompt([{
      type: 'list',
      message: 'Please choose the template',
      default: config.defaultPageTemplate,
      choices: templates,
      name: 'template',
    }]).then(({ template }) => {
      const templateInfo = {
        template: template,
        packagePath: packagePath,
      };

      inquirer.prompt([{
        type: 'confirm',
        message: 'Does it has a parent module?',
        name: 'type'
      }]).then(({ type }) => {
        if (type) {
          inquirer.prompt([{
            type: 'input',
            message: 'Please enter the parent module key: ',
            name: 'parent'
          }]).then(({ parent }) => {
            if (parent) {
              runGeneratePage(templateInfo, parent, pageName)
            }
          })
        } else {
          runGeneratePage(templateInfo, null, pageName)
        }
      })
    })
  })
}

module.exports = generatePage;
