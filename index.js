#!/usr/bin/env node
'use strict'

const commander = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')

const runGeneratePage = require('./lib/page')

commander
  .version('0.1.0')
  .option('-h, --help', 'show help')
  .option('-c, --create [value]', 'create a new page')
  .parse(process.argv);

commander.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new module'))
  console.log('    $ npm run init -c moduleName')
  console.log()
})

if (commander.create) {
  inquirer.prompt([{
    type: 'confirm',
    message: 'Does it has a parent module?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      inquirer.prompt([{
        type: 'input',
        message: 'Please enter the parent module key: ',
        name: 'key'
      }]).then(module => {
        if (module.key) {
          console.log(module.key, commander.create)
          generatePage(module.key, commander.create)
        }
      })
    } else {
      generatePage(null, commander.create)
    }
  })
}

function generatePage(moduleName, pageName) {
  runGeneratePage(moduleName, pageName)
}