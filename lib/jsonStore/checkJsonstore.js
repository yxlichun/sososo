#!/usr/bin/env node

const chalk = require('chalk');
const request = require('superagent');
const config = require('../config');
const fileName = require('../../utils/fileName');

const checkJsonStore = (componentName) => {
  const pureName = fileName.getPureComponentName(componentName);
  return request
  .get(`https://www.jsonstore.io/${config.jsonstoreKey}/${pureName}`)
  .then((res) => {
    if (res.body && res.body.result) {
      console.log('****');
      console.log(chalk.green(`${componentName}:`), res.body.result);
      console.log('****');

      return false;
    } else if (res.body && res.body.ok) {
      return true;
    }
    return true;
  })
}

module.exports = checkJsonStore;

// curl -XPOST -H "Content-type: application/json" -d '{"name": "lichun"}' 'https://www.jsonstore.io/94f0f3c9e704c6c7626e117daa563cfb633a0944c0e285366487cddabbab4ab0/lichun'

// curl -XGET 'https://www.jsonstore.io/94f0f3c9e704c6c7626e117daa563cfb633a0944c0e285366487cddabbab4ab0/test'
