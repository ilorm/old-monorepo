'use strict';

const fields = require('./fields');
const operations = require('./operations');

/**
 * Create a property option object (Object.defineProperty)
 * With a value field only ;
 * configurable: false,
 * writable: false,
 * enumerable : false,
 * @param {Mixed} variable The variable to associate with the value
 * @returns {Object} The param object
 */
const declareValue = variable => ({ value: variable, });


/**
 * Class representing a queryBuilder
 * It's used by the framework to build query
 */
class Query {
  /**
   * Create a new queryBuilder
   * @param {Model} modelObject The model used to create the query
   */
  constructor(modelObject) {
    Object.defineProperties(this, {
      [fields.SCHEMA]: declareValue(modelObject.getSchema()),
      [fields.CONNECTOR]: declareValue(modelObject.getConnector()),
      [fields.QUERY]: declareValue({}),
    });

    this[fields.SCHEMA].properties.forEach(property => {
      const propertyDefinition = this[fields.SCHEMA].definition[property];

      Object.defineProperty(this, property, declareValue(propertyDefinition.getQueryOperations(this)));
    });
  }
}

Query.FIELDS = fields;
Query.OPERATIONS = operations;

module.exports = Query;
