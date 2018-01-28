'use strict';

const { OPERATIONS, } = require('ilorm').Query;

const operatorConversion = {
  [OPERATIONS.IS]: '$eq',
  [OPERATIONS.IS_NOT]: '$ne',
  [OPERATIONS.IS_IN]: '$in',
  [OPERATIONS.IS_NOT_IN]: '$nin',
  [OPERATIONS.GREATER_THAN]: '$gt',
  [OPERATIONS.LOWER_THAN]: '$lt',
  [OPERATIONS.GREATER_OR_EQUAL_THAN]: '$gte',
  [OPERATIONS.LOWER_OR_EQUAL_THAN]: '$lte',
};

/**
 * Convert a valid inputQuery to a query
 * @param {Query} query The ilorm query you want to convert
 * @returns {Object} The mongo query
 */
function convertQueryToMongoQuery(query) {
  if (!query) {
    return {};
  }

  const $and = [];

  const keys = {};

  query.queryBuilder({
    onOr: arrayOfQuery => {
      $and.push({
        $or: arrayOfQuery.map(query => convertQueryToMongoQuery(query)),
      });
    },
    onOperator: (key, operator, value) => {
      if (!keys[key]) {
        keys[key] = {};
      }

      if (operatorConversion[operator]) {
        const mongoOperator = operatorConversion[operator];

        keys[key][mongoOperator] = value;

      } else if (operator === OPERATIONS.BETWEEN) {
        keys[key].$gt = value.min;
        keys[key].$lt = value.max;

      } else {
        throw new Error(`connector.MongoDB: UNDEFINED OPERATOR : ${operator}`);
      }
    },
  });

  for (const key of Object.keys(keys)) {
    $and.push({
      [key]: keys[key],
    });
  }

  if ($and.length === 1) {
    return $and[0];
  }

  return { $and, };
}

module.exports = convertQueryToMongoQuery;
