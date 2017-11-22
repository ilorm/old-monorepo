'use strict';

const queryFields = require('../../query/fields');

const declareOperationFactory = (query = {}, key, operation) => params => {
  query[queryFields.query][key][operation] = params;

  return query;
};

module.exports = declareOperationFactory;
