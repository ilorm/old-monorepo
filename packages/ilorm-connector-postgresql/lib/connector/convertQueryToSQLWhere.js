'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;

const operatorConversion = {
  [OPERATIONS.IS]: '=',
  [OPERATIONS.IS_NOT]: '!=',
  [OPERATIONS.IS_IN]: 'IN',
  [OPERATIONS.IS_NOT_IN]: 'NOT IN',
  [OPERATIONS.LOWER_OR_EQUAL_THAN]: '<=',
  [OPERATIONS.GREATER_OR_EQUAL_THAN]: '>=',
  [OPERATIONS.LOWER_THAN]: '<',
  [OPERATIONS.GREATER_THAN]: '>',
};

/**
 * Browse input query and call handler per each combination of key, operator, value
 * @param {Object} inputQuery The query to browse
 * @param {Function} handler The handler will be called per each combination
 * @returns {Void} Return nothing
 */
function browseQuery(inputQuery, handler) {
  for (const key of Object.keys(inputQuery)) {
    for (const operator of Object.keys(inputQuery[key])) {
      const value = inputQuery[key][operator];

      handler(key, operator, value);
    }
  }
}

/**
 * Generate a SQL WHERE clause from an ilorm Query
 * @param {Object} inputQuery The query to convert
 * @param {Number} [paramIndex=1] The index to handle parameter query
 * @returns {string} A SQL WHERE clause
 */
const convertQueryToSQLWhere = (inputQuery, paramIndex = 1) => {
  const values = [];
  const clauses = [];

  /**
   * Define a new SQL Operation
   * @param {String} key The target key
   * @param {String} sqlOperator The operator to apply
   * @param {Mixing} value The value to compare
   * @returns {void} return nothing
   */
  const addSQLOperation = (key, sqlOperator, value) => {
    values.push(value);
    clauses.push(`${key} ${sqlOperator} $${paramIndex++}`);
  };

  if (!inputQuery) {
    return '';
  }

  browseQuery(inputQuery, (key, operator, value) => {
    if (operatorConversion[operator]) {
      const sqlOperator = operatorConversion[operator];

      addSQLOperation(key, sqlOperator, value);
    } else if (operator === OPERATIONS.BETWEEN) {
      addSQLOperation(key, '>=', value);
      addSQLOperation(key, '<=', value);
    } else {
      throw new Error(`connector.PostgreSQL: UNDEFINED OPERATOR : ${operator}`);
    }
  });

  return {
    query: clauses.join(' AND '),
    paramIndex,
    values,
  };
};

module.exports = convertQueryToSQLWhere;
