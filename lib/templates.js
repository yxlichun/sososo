const fs = require('fs');
const path = require('path');
const config = require('../util/config').getConfig();

const Templates = {};

Templates.checkTemplateVersion = function() {
  const file = fs.readFileSync(path.join(config.templatePath, 'package.json'));
  const templateFeature = JSON.parse(file);
  return templateFeature.version;
}

Templates.getTemplates = function() {
  const arr = [];
  const templatePath = path.join(config.templatePath, '/src/containers');
  const files = fs.readdirSync(templatePath);

  files.forEach(function (item, index) {
      const stat = fs.lstatSync(path.join(templatePath, item));
      if (stat.isDirectory() === true) { 
        arr.push(item)
      }
  });

  return arr;
}

module.exports = Templates;
