'use strict';

function runForEachContext (context, handler) {
  if(context === null) {
    throw new Error('Context missing');
  }

  context = [].concat(context);
  context.forEach(handler);
  context = null;
}

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