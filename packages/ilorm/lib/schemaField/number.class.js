'use strict';

const operations = require('../query/operations');
const declareOperation = require('./helpers/declareOperation');
const SchemaField = require('./schemaField.class');

/**
 * Class representing a Number field
 */
class Number extends SchemaField {

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @return {Object} The query operations
   */
  getQueryOperations(query) {
    const queryOperations = super.getQueryOperations(query);

    queryOperations[operations.BETWEEN] = declareOperation(query, this._name, operations.BETWEEN);
    queryOperations[operations.MIN] = declareOperation(query, this._name, operations.MIN);
    queryOperations[operations.MAX] = declareOperation(query, this._name, operations.MAX);

    return queryOperations;
  }

}

module.exports = Number;
