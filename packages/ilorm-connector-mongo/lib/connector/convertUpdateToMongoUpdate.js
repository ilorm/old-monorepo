'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;
const { PUSH, } = require('../query/operations');

const convert = {
  [OPERATIONS.ADD]: '$inc',
  [OPERATIONS.SET]: '$set',
  [PUSH]: '$push',
};

/**
 * Convert a valid update ilorm query to an update mongo query.
 * @param {Query} query The ilorm query you want to convert
 * @returns {Object} The result mongo Query.
 */
function convertQueryToMongoQuery(query) {
  if (!query) {
    return {};
  }

  const updateMongo = {};

  query.updateBuilder({
    onOperator: (key, operator, value) => {
      const mongoOperator = convert[operator] || null;

      if (!mongoOperator) {
        throw new Error(`connector.MongoDB - UNDEFINED OPERATOR : ${operator} `);
      }

      if (!updateMongo[mongoOperator]) {
        updateMongo[mongoOperator] = {};
      }

      updateMongo[mongoOperator][key] = value;
    },
  });

  return updateMongo;
}

module.exports = convertQueryToMongoQuery;
