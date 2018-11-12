const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs');
const path = require('path');

const config = require('../config');
const runGeneratePage = require('./page');
const Template = require('../../utils/template');

function generatePage(pageName) {
  const templatesInfo = Template.getTemplateInfo(Template.checkTemplateVersion(), config.pagePath);
  if (templatesInfo && templatesInfo.templates) {
    inquirer.prompt([{
      type: 'list',
      message: 'Please choose the template',
      default: config.defaultPageTemplate,
      choices: templatesInfo.templates,
      name: 'template',
    }]).then(({ template }) => {
      const templateInfo = {
        template: template,
        packagePath: templatesInfo.packagePath,
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
  }
}

module.exports = generatePage;
