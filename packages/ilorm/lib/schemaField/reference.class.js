'use strict';

const operations = require('../query/operations');
const fields = require('../query/fields');
const declareOperation = require('./helpers/declareOperation');
const SchemaField = require('./schemaField.class');

/**
 * Class representing a reference field
 */
class Reference extends SchemaField {

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @return {Object} The query operations
   */
  getQueryOperations(query) {
    const resultQueryOperations = super.getQueryOperations();

    resultQueryOperations[operations.LINKED_WITH] = declareOperation({
      query,
      operation: operations.LINKED_WITH,
      field: fields.QUERY,
      key: this.name,
    });

    return resultQueryOperations;
  }

  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {Boolean} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    return value;
  }
}

module.exports = Reference;
