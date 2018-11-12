var path = require('path')
var chalk = require('chalk')

function getUpdateData(mode, data) {
  if (mode === 'module') {
    return [{
      path: path.resolve(process.cwd(), 'src/config/menu.conf.js'),
      position: {
        name: 'menu',
        type: 'ArrayExpression',
        only: true,
      },
      content: JSON.stringify({
        key: data.pageNameLower,
        text: data.pageNavChineseName,
        icon: 'setting',
      }),
    }]
  }
  if (mode === 'page') {
    return [{
      path: path.resolve(process.cwd(), 'src/config/menu.conf.js'),
      position: {
        name: 'menu',
        type: 'ArrayExpression',
        only: false,
        flag: function (key) {
          return function(node, parent) {
            if (node.elements) {
              for (let i = 0; i < node.elements.length; i++) {
                if (node.elements[i].properties && node.elements[i].properties[0].value && node.elements[i].properties[0].value.value === key) {
                  const props = node.elements[i].properties;
                  for (let j = 1; j < props.length; j ++) {
                    if (props[j].key && props[j].key.name === 'children' && props[j].value) {
                      return props[j].value.elements;
                    }
                  }
                }
              }
            }
            console.log(chalk.yellow('warning: can not find parent module, please add it manually'))
            return [];
          }
        }(data.moduleName)
      },
      content: JSON.stringify({
        key: data.pageNameLower,
        text: data.pageNavChineseName,
      }),
    }]
  }
}

module.exports = getUpdateData;
