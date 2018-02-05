'use strict';

const SCHEMA = Symbol('Child schema');
const { Schema, } = require('ilorm');
const { SchemaField, } = Schema.Types;

/**
 * Class representing a Object field
 */
class ObjectField extends SchemaField {
  /**
   * Intantiate an object field with a child schema use to set rule to the child object
   * @param {Object} childSchema The child object to use
   */
  constructor(childSchema) {
    super();

    this[SCHEMA] = new Schema(childSchema);
  }


  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @return {Object} The query operations
   */
  getQueryOperations({ name, query, }) {
    const queryOperations = super.getQueryOperations({
      name,
      query,
    });

    this[SCHEMA].properties.forEach(property => {
      const propertyDefinition = this[SCHEMA].definition[property];
      const queryOperationsConfig = {
        query,
        name: `${name}.${property}`,
      };
      const propertyValue = propertyDefinition.getQueryOperations(queryOperationsConfig);

      Object.defineProperty(queryOperations, property, { value: propertyValue, });
    });

    return queryOperations;
  }

  /**
   * Init the given instance field
   * @param {Object} instance instance to init
   * @param {String} field field to init
   * @return {*} The initied field value
   */
  init(instance, field) {
    const value = instance[field];

    return this[SCHEMA].initInstance(value);
  }
}

module.exports = ObjectField;
