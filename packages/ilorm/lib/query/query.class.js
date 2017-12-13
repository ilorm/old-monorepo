'use strict';

const fields = require('./fields');
const operations = require('./operations');


/**
 * Class representing a queryBuilder
 * It's used by the framework to build query
 */
class Query {
  /**
   * Init the query object
   */
  constructor() {
    this.declareQueryFields();
  }

  /**
   * Init query fields
   * @returns {void} return nothing
   */
  declareQueryFields() {
    this[fields.SCHEMA].properties.forEach(property => {
      const propertyDefinition = this[fields.SCHEMA].definition[property];

      Object.defineProperty(this, property, { value: propertyDefinition.getQueryOperations(this), });
    });
  }

  /**
   * Find one instance from the query
   * @returns {Model} Return an instance of the linked model
   */
  async findOne() {
    const rawResult = await this[fields.CONNECTOR].findOne(this[fields.QUERY]);

    return this[fields.MODEL].instantiate(rawResult);
  }
}

Query.FIELDS = fields;
Query.OPERATIONS = operations;

module.exports = Query;
