'use strict';

const classIndex = {};

module.exports = {
  declare: (className, Class) => {
    classIndex[className] = Class;
  },
  get: className => classIndex[className],
};