'use strict';

function declareOperationFactory(query, key, operation) {
  return (params) => {
    query._ilormQuery[key] = (query._ilormQuery[key] || {})[operation] = params;

    return query;
  }
}

module.exports = declareOperationFactory;
