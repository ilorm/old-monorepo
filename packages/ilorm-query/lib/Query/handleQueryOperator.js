'use strict';

const runForEachContext = require('./runForEachContext');

function handleOperator (query, operator, value) {
  runForEachContext(query.context, (context) => {
    query.query.push(
      Promise.resolve({
        operator,
        context,
        value
      })
    );
  });
  return query;
}

module.exports = handleOperator;