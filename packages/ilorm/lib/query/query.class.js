'use strict';

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
      _ilormSchema: declareValue(modelObject.getSchema()),
      _ilormConnector: declareValue(modelObject.getConnector()),
      _ilormQuery: declareValue({}),
    });

    this._ilormSchema.properties.forEach(property => {
      const propertyDefinition = this._ilormSchema.definition[property];

      Object.defineProperty(this, property, declareValue(propertyDefinition.getQueryOperations(this)));
    });

  }
}

module.exports = Query;
