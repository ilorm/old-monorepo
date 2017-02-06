'use strict';

const runForEachContext = require('./runForEachContext');

/**
 * Handle a query operator, for each context linked with the query bind the given operator
 * @param {Query} query The current query
 * @param {Object} operator The operator to apply
 * @param {*} value The value linked with the operator
 * @returns {Query} Return the current query
 */
function handleOperator(query, operator, value) {
  runForEachContext(query.context, context => {
    query.query.push(
      Promise.resolve({
        operator,
        context,
        value,
      })
    );
  });

  return query;
}

module.exports = handleOperator;
