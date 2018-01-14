'use strict';

const operations = require('../query/operations');
const declareOperation = require('./helpers/declareOperation');
const SchemaField = require('./schemaField.class');

const DATE_OPERATIONS = [
  operations.BETWEEN,
  operations.MAX,
  operations.MIN,
];

/**
 * Representing a date in the schema field
 */
class Date extends SchemaField {

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @return {Object} The query operations
   */
  getQueryOperations(query) {
    const queryOperations = super.getQueryOperations(query);

    DATE_OPERATIONS.forEach(operation => {
      queryOperations[operation] = declareOperation({
        query,
        operation,
        key: this._name,
      });
    });

    return queryOperations;
  }

  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {Date} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  }
}

module.exports = Date;
