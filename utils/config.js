/**
 * 获取配置，若项目中找不到sososo.conf.js，则使用init.conf.js
 */
const path = require('path')
const fs = require('fs')
const defaultConfig = require('../lib/init.conf')

const config = {};
config.getConfig = function() {
  const conf = path.join(process.cwd(), 'sososo.conf.js')
  if (fs.existsSync(conf)) {
    return require(conf)
  }
  return defaultConfig;
}

module.exports = config;
