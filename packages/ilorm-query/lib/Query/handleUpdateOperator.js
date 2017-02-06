'use strict';

const runForEachContext = require('./runForEachContext');

/**
 * Handle a update operator, for each context linked with the query bind the given operator
 * @param {Query} query The current query
 * @param {Object} operator The operator to apply
 * @param {*} value The value linked with the operator
 * @returns {Query} Return the current query
 */
function handleUpdateOperator(query, operator, value) {
  runForEachContext(query.context, context => {
    query.update.push(
      Promise.resolve({
        operator,
        context,
        value,
      })
    );
  });

  return query;
}

module.exports = handleUpdateOperator;
