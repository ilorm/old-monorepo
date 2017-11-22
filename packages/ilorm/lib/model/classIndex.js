'use strict';

const classIndex = new Map();

module.exports = {
  declare: (className, Class) => {
    classIndex.set(className, Class);
  },
  get: className => classIndex.get(className),
};
