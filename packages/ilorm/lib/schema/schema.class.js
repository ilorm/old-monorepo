'use strict';

const UNDEFINED_PROPERTIES_POLICY = {
  KEEP: 'keep',
  ERROR: 'error',
  ERASE: 'erase',
};

const DEFAULT_OPTIONS = {
  undefinedProperties: UNDEFINED_PROPERTIES_POLICY.ERASE,
};

const UNDEFINED_INDEX = -1;

/**
 * Class representing schema of data
 */
let Schema = class Schema {
  /**
   * Instantiate a new schema
   * @param {Object} schemaDefinition The definition to apply
   * @param {Object} options Options to apply to the schema
   */
  constructor(schemaDefinition, options = DEFAULT_OPTIONS) {
    this.definition = schemaDefinition;
    this.properties = Object.keys(this.definition);
    this.properties.forEach(property => {
      this.definition[property]._name = property;
    });
    this.undefinedPropertyPolicy = options.undefinedPropertyPolicy;
  }

  /**
   * Get the proxy associated with the specific schema
   * @returns {Object} Return a Proxy configuration object
   */
  getProxy() {
    return {
      get: (instance, property) => instance[property],
      set: (instance, property, value) => {
        if (!this.properties.includes(property)) {
          if (typeof property === 'symbol') {
            instance[property] = value;

            return true;
          }

          return new Error(`${property} does not exists in this model.`);
        }

        instance[property] = this.definition[property].castValue(value);

        return true;
      },

      /*
      deleteProperty: (instance, property) => {

      },
      */

    };
  }

  /**
   * Init a new instance following the schema
   * @param {Object=} rawObject the base object to use
   * @return {Object} An object following the schema (init or raw json)
   */
  async init(rawObject = {}) {
    const rawProperties = Object.keys(rawObject);

    await this.properties.forEach(async property => {
      await this.definition[property].init(rawObject, property);

      const rawPropertyIndex = rawProperties.indexOf(property);

      if (rawPropertyIndex > UNDEFINED_INDEX) {
        rawProperties.splice(rawPropertyIndex, 1);
      }
    });

    if (rawProperties.length > 0 && this.undefinedPropertyPolicy !== UNDEFINED_PROPERTIES_POLICY.KEEP) {
      if (this.undefinedPropertyPolicy === UNDEFINED_PROPERTIES_POLICY.ERROR) {
        throw new Error(`Undefined property declared in the raw object : ${rawProperties[0]}`);
      }

      // UNDEFINED_PROPERTIES_POLICY.ERASE
      rawProperties.forEach(rawProperty => {
        delete rawObject[rawProperty];
      });
    }

    return rawObject;
  }

  /**
   * Create a new instance from a model, respecting the given schema
   * @param {Object} modelInstance the object to use as a model
   * @returns {Object} Create a new object respecting the schema
   */
  async initInstance(modelInstance = {}) {
    const instance = {};

    const initAllFields = this.properties.map(async property => {
      instance[property] = await this.definition[property].init(modelInstance, property);

      return null;
    });

    await Promise.all(initAllFields);

    return instance;
  }

  /**
   * Check if a json object valid the given schema
   * TODO
   * @return {null} null;
   */
  isValid() {
    return null;
  }
};

/**
 * Overload schema class by another (to plugin)
 * @param {Schema} Class A new Schema to replace the current one (plugin)
 * @returns {void} Return nothing
 */
const overload = Class => {
  Schema = Class;
  Schema.overload = overload;
};

Schema.overload = overload;

module.exports = Schema;
