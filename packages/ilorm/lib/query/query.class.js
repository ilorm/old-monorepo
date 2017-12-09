'use strict';

const fields = require('./fields');
const operations = require('./operations');

const declareValue = item => ({ value: item, });

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
      [fields.schema]: declareValue(modelObject.getSchema()),
      [fields.connector]: declareValue(modelObject.getConnector()),
      [fields.query]: declareValue({}),
    });

    this[fields.schema].properties.forEach(property => {
      const propertyDefinition = this[fields.schema].definition[property];

      Object.defineProperty(this, property, declareValue(propertyDefinition.getQueryOperations(this)));
    });

  }
}

Query.FIELDS = fields;
Query.OPERATIONS = operations;

module.exports = Query;
