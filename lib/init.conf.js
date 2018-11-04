var path = require('path')

var config = {};

var baseConfig = {
  module: {
    destBasePath: path.resolve(process.cwd(), 'src/containers'),
    templatePath: path.resolve(__dirname, '../newTemplate/ToolbarTableModal'),
    templateModuleName: 'DevExample',// 直接匹配末端路由
    templatePageName: 'CommonExample',
  },
  page: {
    destBasePath: path.resolve(process.cwd(), 'src/pages'),
    templatePath: path.resolve(__dirname, '../template'),
    templatePageName: 'CommonExample',
  },
}

config.getBasicConfig = function(mode) {
  return baseConfig[mode];
}

config.getUpdateData = function(mode, data) {
  if (mode === 'module') {
    return [{
      path: path.resolve(process.cwd(), 'src/config/menu.conf.js'),
      position: {
        name: 'menu',
        type: 'ArrayExpression',
        only: true,
      },
      content: JSON.stringify({
        key: data.route,
        text: data.moduleNavChineseName,
        icon: 'setting',
      }),
    }]
  }
  if (mode === 'page') {
    console.log(data.moduleName, '00000');
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
            return [];
          }
        }(data.moduleName)
      },
      content: JSON.stringify({
        key: data.route,
        text: data.pageNavChineseName,
      }),
    }]
  }
}

module.exports = config;
