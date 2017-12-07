'use strict';

const OPERATIONS = require('ilorm').Query;

const operatorConversion = {
  [OPERATIONS.IS]: '$eq',
  [OPERATIONS.IS_NOT]: '$ne',
  [OPERATIONS.IS_IN]: '$in',
  [OPERATIONS.IS_NOT_IN]: '$nin',
  [OPERATIONS.MIN]: '$gt',
  [OPERATIONS.MAX]: '$lt',
};

/**
 * Convert a valid inputQuery to a MongoQuery
 * @param {Object} inputQuery The ilorm query you want to convert
 * @returns {Object} The mongo query
 */
function convertQueryToMongoQuery(inputQuery) {
  if (!inputQuery || inputQuery.length === 0) {
    return {};
  }

  const $and = inputQuery.map(inputQueryElement => {
    if (operatorConversion[inputQueryElement.operator]) {
      const operator = operatorConversion[inputQueryElement.operator];

      const context = { [operator]: inputQueryElement.value, };

      return { [inputQueryElement.context]: context, };
    }

    if (inputQueryElement === OPERATIONS.BETWEEN) {
      const context = {
        $gt: inputQueryElement.value.min,
        $lt: inputQueryElement.value.max,
      };

      return { [inputQueryElement.context]: context, };
    }

    throw new Error('Connector.MongoDB', 'UNDEFINED OPERATOR : ', inputQueryElement.operator);
  });

  return { $and, };
}

module.exports = convertQueryToMongoQuery;
