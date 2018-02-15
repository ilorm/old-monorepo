'use strict';

const { OPERATIONS, FIELDS, } = require('ilorm-constants').QUERY;
const declareOperation = require('./helpers/declareOperation');

/**
 * Generate ReferenceField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {ReferenceField} The new Reference field
 */
const getReferenceField = SchemaField => {
  /**
   * Class representing a reference field
   */
  class ReferenceField extends SchemaField {

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @return {Object} The query operations
     */
    getQueryOperations({ query, }) {
      const resultQueryOperations = super.getQueryOperations();

      resultQueryOperations[OPERATIONS.LINKED_WITH] = declareOperation({
        query,
        operation: OPERATIONS.LINKED_WITH,
        field: FIELDS.QUERY,
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

  return ReferenceField;
};

module.exports = getReferenceField;
