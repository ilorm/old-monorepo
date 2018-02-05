'use strict';

const { FIELDS, } = require('ilorm-constants').QUERY;
const { PUSH, } = require('../query/operations');
const { Schema, } = require('ilorm');
const { SchemaField, } = Schema.Types;

const SCHEMA = Symbol('Child schema');

/**
 * Class representing a Array field
 */
class ArrayField extends SchemaField {
  /**
   * Intantiate an array field with a child schema use to set rule to the child array
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
    const key = name || this._name;

    queryOperations[PUSH] = params => {
      if (!query[FIELDS.UPDATE][key]) {
        query[FIELDS.UPDATE][key] = {};
      }

      query[FIELDS.UPDATE][key][PUSH] = params;

      return query;
    };

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
    const arrayOfValues = instance[field];

    if (typeof arrayOfValues !== 'object' || !Array.isArray(arrayOfValues)) {
      throw new Error(`${field} is not an Array in the ArrayField definition`);
    }

    const initValueList = arrayOfValues.map(value => this[SCHEMA].initInstance(value));

    return Promise.all(initValueList);
  }
}

module.exports = ArrayField;
