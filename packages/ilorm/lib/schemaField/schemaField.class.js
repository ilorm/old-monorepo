'use strict';

const operations = require('../query/operations');
const declareOperation = require('./helpers/declareOperation');

/**
 * Class representing a field of the schema
 */
class SchemaField {

  /**
   * Create a new Schema field
   */
  constructor() {
    this._isRequired = false;
    this._default = null;
    this._deprecated = null;
    this._name = null;
  }

  /**
   * Check if the given value is valid for the given field
   * @param {*} value The value to check
   * @return {boolean} Return true if the given value is valid of the current field
   */
  async isValid(value) { // eslint-disable-line
    return true;
  }

  /**
   * Init the given instance field
   * @param {Object} instance instance to init
   * @param {String} field field to init
   * @return {*} The initied field value
   */
  async init(instance, field) {
    const value = instance[field];

    if (value !== undefined) {
      if (!await this.isValid(value)) {
        throw new Error(`Invalid ${value} for field ${this._name}`);
      }

      return value;
    }

    if (this._deprecated) {

      return null;
    }

    if (typeof this._default === 'function') {
      instance[field] = await this._default();

      return instance[field];
    }

    instance[field] = this._default;

    return instance[field];
  }

  /**
   * Declare the field as required
   * @param {boolean} [isRequired=true] define the field as required or not
   * @return {SchemaField} Return the field (to chainable definition)
   */
  required(isRequired = true) {
    this._isRequired = isRequired;

    return this;
  }

  /**
   * Set the default value of the field
   * @param {*} value The default value
   * @return {SchemaField} Return the field (to chainable definition)
   */
  default(value) {
    this._default = value;

    return this;
  }

  /**
   * Mark the field as deprecated
   * @param {Object} options Options apply to the deprecated field
   * @return {SchemaField} Return the field (to chainable definition)
   */
  deprecated(options) {
    this._deprecated = options;

    return this;
  }

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @return {Object} The query operations
   */
  getQueryOperations(query) {
    return {
      [operations.IS]: declareOperation(query, this._name, operations.IS),
      [operations.IS_NOT]: declareOperation(query, this._name, operations.IS_NOT),
      [operations.IS_IN]: declareOperation(query, this._name, operations.IS_IN),
      [operations.IS_NOT_IN]: declareOperation(query, this._name, operations.IS_NOT_IN),
    };
  }
}

module.exports = SchemaField;
