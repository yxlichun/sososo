const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../util/config').getConfig();

const Templates = {};

Templates.getTemplatesPackagePath = function() {
  let packagePath = path.resolve(__dirname, '../node_modules', config.templatePackage);
  return new Promise((resolve, reject) => {
    fs.access(packagePath, fs.constants.F_OK, (err) => {
      if (err) {
        packagePath = path.resolve(__dirname, '../../', config.templatePackage);
        fs.access(packagePath, fs.constants.F_OK, (err) => {
          if (err) {
            packagePath = path.resolve(__dirname, '../../', config.templatePackage);
            fs.access(packagePath, fs.constants.F_OK, (err) => {
              if (err) {
                reject(false);
              }
              resolve(packagePath);
            })
          } else {
            resolve(packagePath);
          }
        })
      } else {
        resolve(packagePath);
      }
    });
  })
}

Templates.checkTemplateVersion = function() {
  return new Promise((resolve) => {
    Templates.getTemplatesPackagePath().then((res) => {
      const file = fs.readFileSync(path.join(res, 'package.json'));
      const templateFeature = JSON.parse(file);

      console.log(chalk.yellow('The template version is ' + templateFeature.version));
      console.log();
      resolve(res);
    })
  })
}

Templates.getTemplatesInfo = function(packagePath) {
  return new Promise((resolve) => {
    if (packagePath) {
      resolve({
        templates: getTemplatesFolds(packagePath),
        packagePath: packagePath,
      });
    } else {
      Templates.getTemplatesPackagePath().then((res) => {
        resolve({
          templates: getTemplatesFolds(res),
          packagePath: res,
        });
      })
    }
  })
}

function getTemplatesFolds(packagePath) {
  const arr = [];
  const templatePath = path.join(packagePath, '/src/containers');
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
