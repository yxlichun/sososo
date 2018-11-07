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
  .version('0.1.1')
  .option('-c, --create [value]', 'create a new page')
  .parse(process.argv);

// 获取可选模板类型；
const templates = Templates.getTemplates();

console.log(chalk.yellow('The template version is ' + Templates.checkTemplateVersion()) );
console.log();

// 用户选择模板
inquirer.prompt([{
  type: 'list',
  message: 'Please choose the template',
  default: config.defaultTemplate,
  choices: templates,
  name: 'template',
}]).then(({ template }) => {
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
          console.log(template, parent, commander.create)
          runGeneratePage(template, parent, commander.create)
        }
      })
    } else {
      console.log(template, null, commander.create)
      runGeneratePage(template, null, commander.create)
    }
  })
})
