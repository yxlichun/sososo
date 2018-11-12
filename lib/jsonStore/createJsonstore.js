#!/usr/bin/env node

const chalk = require('chalk');
const request = require('superagent');
const config = require('../config');
const fileName = require('../../utils/fileName');

const createJsonStore = (componentName, author) => {
  const pureName = fileName.getPureComponentName(componentName);
  request
    .post(`https://www.jsonstore.io/${config.jsonstoreKey}/${pureName}`)
    .send({
      name: pureName,
      author,
      createDate: new Date(),
    })
    .end((err, res) => {
      if (err) throw err;
    })
}

module.exports = createJsonStore;

// curl -XPOST -H "Content-type: application/json" -d '{"name": "lichun"}' 'https://www.jsonstore.io/94f0f3c9e704c6c7626e117daa563cfb633a0944c0e285366487cddabbab4ab0/lichun'

// curl -XGET 'https://www.jsonstore.io/94f0f3c9e704c6c7626e117daa563cfb633a0944c0e285366487cddabbab4ab0/test'
