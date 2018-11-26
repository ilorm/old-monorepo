'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;
const { PUSH, } = require('../query/operations');

const convert = {
  [OPERATIONS.ADD]: ({ key, value, }) => item => {
    item[key] += value;

    return item;
  },
  [OPERATIONS.SET]: ({ key, value, }) => item => {
    item[key] = value;

    return item;
  },
  [PUSH]: ({ key, value, }) => item => {
    item[key].push(value);

    return item;
  },
};

/**
 * Convert a valid update ilorm query to an update memory query.
 * @param {Query} query The ilorm query you want to convert
 * @returns {Object} The result memory query.
 */
function convertUpdateToMemoryUpdate(query) {
  if (!query) {
    return {};
  }

  /**
   * Function update mongo (per default identity function do not change the parameter)
   * @param {Object} item The input item
   * @return {Object} The converted result
   */
  let updateMongo = item => item;

  query.updateBuilder({
    onOperator: (key, operator, value) => {
      const mongoOperator = convert[operator] || null;

      if (!mongoOperator) {
        throw new Error(`connector.MongoDB - UNDEFINED OPERATOR : ${operator} `);
      }

      updateMongo = item => mongoOperator({
        key,
        value,
      })(item);

    },
  });

  return updateMongo;
}

module.exports = convertUpdateToMemoryUpdate;
