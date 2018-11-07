#!/usr/bin/env node
'use strict'

const commander = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs');
const path = require('path');

const config = require('./util/config').getConfig();
const runGeneratePage = require('./lib/page');
const Templates = require('./lib/templates');

commander
  .version('0.1.4')
  .option('-c, --create [value]', 'create a new page')
  .parse(process.argv);

Templates.checkTemplateVersion()
  .then(Templates.getTemplatesInfo)
  .then(({ templates, packagePath }) => {
    inquirer.prompt([{
      type: 'list',
      message: 'Please choose the template',
      default: config.defaultTemplate,
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
              runGeneratePage(templateInfo, parent, commander.create)
            }
          })
        } else {
          runGeneratePage(templateInfo, null, commander.create)
        }
      })
    })
  })
