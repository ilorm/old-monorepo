'use strict';

const { OPERATIONS, } = require('ilorm').Query;

const operatorConversion = {
  [OPERATIONS.IS]: '$eq',
  [OPERATIONS.IS_NOT]: '$ne',
  [OPERATIONS.IS_IN]: '$in',
  [OPERATIONS.IS_NOT_IN]: '$nin',
  [OPERATIONS.MIN]: '$gt',
  [OPERATIONS.MAX]: '$lt',
};

/**
 * Convert a valid inputQuery to a query
 * @param {Object} inputQuery The ilorm query you want to convert
 * @returns {Object} The mongo query
 */
function convertQueryToMongoQuery(inputQuery) {
  if (!inputQuery) {
    return {};
  }

  const $and = [];

  for (const key of Object.keys(inputQuery)) {
    const currentKey = {
      [key]: {},
    };

    for (const operator of Object.keys(inputQuery[key])) {
      const value = inputQuery[key][operator];

      if (operatorConversion[operator]) {
        const mongoOperator = operatorConversion[operator];

        currentKey[key][mongoOperator] = value;

      } else if (operator === OPERATIONS.BETWEEN) {
        currentKey[key].$gt = value.min;
        currentKey[key].$lt = value.max;

      } else {
        throw new Error(`connector.MongoDB: UNDEFINED OPERATOR : ${operator}`);
      }
    }

    $and.push(currentKey);
  }

  if($and.length === 1) {
    return $and[0];
  }

  return { $and, };
}

module.exports = convertQueryToMongoQuery;
