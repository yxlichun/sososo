const chalk = require('chalk');
const user = require('../../utils/user');
const copyTemplate = require('./copyTemplate');
const checkJsonStore = require('../jsonStore/checkJsonstore');
const createJsonStore = require('../jsonStore/createJsonstore');

function generateComponent(componentName) {
  user.getUserInfo().then((author) => {
    checkJsonStore(componentName).then((res) => {
      if (res) { // create
        copyTemplate(componentName, author).then(() => {
          createJsonStore(componentName, author);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        console.log(chalk.yellow(`${componentName} is already exist, please change a other name , or run *sofa -d ${componentName}* to delete the declare`));
      }
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = generateComponent;
