'use strict';

const operations = require('../query/operations');
const SchemaField = require('./schemaField.class');

const DATE_OPERATIONS = [
  operations.BETWEEN,
  operations.GREATER_THAN,
  operations.GREATER_OR_EQUAL_THAN,
  operations.LOWER_THAN,
  operations.LOWER_OR_EQUAL_THAN,
];

/**
 * Representing a date in the schema field
 */
class Date extends SchemaField {

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @param {Array.<String>} additionalOperations Add operations to the field builder
   * @return {Object} The query operations
   */
  getQueryOperations(query, additionalOperations = []) {
    return super.getQueryOperations(query, DATE_OPERATIONS.concat(additionalOperations));
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
