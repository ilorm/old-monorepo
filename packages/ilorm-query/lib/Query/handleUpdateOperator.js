'use strict';

const runForEachContext = require('./runForEachContext');

function handleUpdateOperator (query, operator, value) {
  runForEachContext(query.context, (context) => {
    query.update.push(
      Promise.resolve({
        operator,
        context,
        value
      })
    );
  });
  return query;
}

module.exports = handleUpdateOperator;