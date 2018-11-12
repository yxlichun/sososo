const prefix = require('../lib/config').prefix;

const fileName = {};

fileName.getHeadUpper = function(name) {
  if (name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  return '';
}

fileName.getHeadLower = function(name) {
  if (name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
  }
  return '';
}

fileName.getFullUpper = function(name) {
  if (name) {
    return name.toUpperCase();
  }
  return '';
}

fileName.getFullLower = function(name) {
  if (name) {
    return name.toLowerCase();
  }
  return '';
}

/**
 * from SofaButton => button
 * from Button => button
 */
fileName.getPureComponentName = (componentName) => {
  let pureName = componentName;
  if (componentName) {
    pureName = componentName.toLowerCase();
    if (pureName.indexOf(prefix) === 0) {
      pureName = pureName.substring(prefix.length);
    }
  }
  return pureName;
}

/**
 * PascalCase
 * from SofaButton => SofaButton
 * from button => SofaButton
 */
fileName.getComponentName = (componentName) => {
  const pureName = fileName.getPureComponentName(componentName);
  return fileName.getHeadUpper(pureName);
}

/**
 * Hyphen
 * from SofaButton => sofa-button
 * from Button => sofa-button
 */
fileName.getHyphenComponentName = (componentName) => {
  const pureName = fileName.getPureComponentName(componentName);
  return `${prefix}-${pureName}`;
}

module.exports = fileName;
