'use strict';

const MAP_KEY_RULE = Symbol('MapKey rule');
const SCHEMA = Symbol('Child schema');
const { Schema, } = require('ilorm');
const { SchemaField, } = Schema.Types;

/**
 * Class representing a Map field
 */
class MapField extends SchemaField {
  /**
   * Intantiate a map field with a child schema use to set rule to the child map
   * @param {Object} childSchema The child schema to use
   */
  constructor(childSchema) {
    super();

    this[SCHEMA] = new Schema(childSchema);
    this[MAP_KEY_RULE] = null;
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

    const proxyRules = {
      get: (obj, prop) => {
        // Existing operation (is, isNot, isNotIn, isIn) :
        if (obj[prop]) {
          return obj[prop];
        }

        // Check if convention exists on the key map and check if the key follow it :
        if (obj[MAP_KEY_RULE]) {
          if (!obj[MAP_KEY_RULE](prop)) {
            throw new Error(`Map key ${prop} does not match the key rule`);
          }
        }

        // Build the subQuery object :
        const subQuery = {};

        this[SCHEMA].properties.forEach(property => {
          const propertyDefinition = this[SCHEMA].definition[property];
          const queryOperationsConfig = {
            query,
            name: `${name}.${prop}.${property}`,
          };
          const propertyValue = propertyDefinition.getQueryOperations(queryOperationsConfig);

          Object.defineProperty(subQuery, property, { value: propertyValue, });
        });

        return subQuery;
      },
    };

    return new Proxy(queryOperations, proxyRules);
  }

  /**
   * Restrict the key of the map to the function rule
   * @param {Function} func function to run to check the validity of the key
   * @returns {MapField} Return map field to chain rule
   */
  restrictKey(func) {
    this[MAP_KEY_RULE] = func;

    return this;
  }

  /**
   * Init the given instance field
   * @param {Object} instance instance to init
   * @param {String} field field to init
   * @return {*} The initied field value
   */
  async init(instance, field) {
    const value = instance[field];
    const keys = Object.keys(value);
    const result = {};

    await Promise.all(keys.map(async key => {
      result[key] = await this[SCHEMA].initInstance(value[key]);
    }));

    return result;
  }
}

module.exports = MapField;
