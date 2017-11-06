'use strict';

const declareOperationFactory = (query = {}, key, operation) => params => {
  query._ilormQuery[key][operation] = params;

  return query;
};

module.exports = declareOperationFactory;
