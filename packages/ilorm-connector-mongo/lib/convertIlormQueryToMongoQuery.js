'use strict';

const operatorConversion = {
  EQUAL: '$eq',
  NOT_EQUAL: '$ne',
  IN: '$in',
  NOT_IN: '$nin',
  MIN: '$gt',
  MAX: '$lt',
};

/**
 * Convert a valid iLormQuery to a MongoQuery
 * @param {Object} iLormQuery The ilorm query you want to convert
 * @returns {Object} The mongo query
 */
function convertIlormQueryToMongoQuery(iLormQuery) {
  if (!iLormQuery || iLormQuery.length === 0) {
    return {};
  }

  const $and = iLormQuery.map(queryElement => {
    if (operatorConversion[queryElement.operator]) {
      const operator = operatorConversion[queryElement.operator];

      const context = { [operator]: queryElement.value, };

      return { [queryElement.context]: context, };
    }

    if (queryElement === 'BETWEEN') {
      const context = {
        $gt: queryElement.value.min,
        $lt: queryElement.value.max,
      };

      return { [queryElement.context]: context, };
    }

    throw new Error('Connector.MongoDB', 'UNDEFINED OPERATOR : ', queryElement.operator);
  });

  return { $and, };
}

module.exports = convertIlormQueryToMongoQuery;
