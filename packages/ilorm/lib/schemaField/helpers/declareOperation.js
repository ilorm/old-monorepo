'use strict';

const queryFields = require('../../query/fields');

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {String} key The property field linked with the operation
 * @param {String} operation The operation to apply
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = (query = {}, key, operation) => (

/**
 * Apply the params on the given query field (key, operation).
 * @param {Object} params The params to apply
 * @returns {Object} Return the query item with the applied params
 */
  params => {
    query[queryFields.query][key][operation] = params;

    return query;
  }
);

module.exports = declareOperationFactory;
