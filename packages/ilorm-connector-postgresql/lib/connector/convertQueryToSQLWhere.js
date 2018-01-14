'use strict';

const { OPERATIONS, } = require('ilorm').Query;

const operatorConversion = {
  [OPERATIONS.IS]: '=',
  [OPERATIONS.IS_NOT]: '!=',
  [OPERATIONS.IS_IN]: 'IN',
  [OPERATIONS.IS_NOT_IN]: 'NOT IN',
  [OPERATIONS.MIN]: '>=',
  [OPERATIONS.MAX]: '<=',
};

/**
 * Generate a SQL WHERE clause from an ilorm Query
 * @param {Object} inputQuery The query to convert
 * @param {Number} [paramIndex=1] The index to handle parameter query
 * @returns {string} A SQL WHERE clause
 */
const convertQueryToSQLWhere = (inputQuery, paramIndex = 1) => {
  let query = '';
  const values = [];

  if (!inputQuery) {
    return '';
  }

  for (const key of Object.keys(inputQuery)) {

    for (const operator of Object.keys(inputQuery[key])) {
      const value = inputQuery[key][operator];

      values.push(value);

      if (operatorConversion[operator]) {
        const sqlOperator = operatorConversion[operator];

        if (query.length > 0) {
          query += ' AND ';
        }

        query += `${key} ${sqlOperator} $${paramIndex++}`;

      } else if (operator === OPERATIONS.BETWEEN) {
        query += `${key} >= $${paramIndex++} AND ${key} <= $${paramIndex++}`;
        values.push(value);


      } else {
        throw new Error(`connector.PostgreSQL: UNDEFINED OPERATOR : ${operator}`);
      }
    }
  }

  return {
    query,
    paramIndex,
    values,
  };
};

module.exports = convertQueryToSQLWhere;