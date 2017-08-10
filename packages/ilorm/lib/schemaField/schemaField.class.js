'use strict';

const operations = require('../query/operations');
const declareOperation = require('./helpers/declareOperation');

class SchemaField {
  constructor() {
    this._isRequired = false;
    this._default = null;
    this._deprecated = null;
    this._name = null;
  }

  async isValid(value) {
    return true;
  }

  async init(instance, field) {
    const value = instance[field];
    if(value !== undefined && !await this.isValid(value)) {
      throw new Error(`Invalid ${value} for field ${this._name}`);
    }


    if(this._deprecated) {

      return null;
    }

    if(typeof(this._default) === 'function') {
      return instance[field] = await this._default();
    }

    instance[field] = this._default;
  }

  required(value = true) {
    this._isRequired = value;

    return this;
  }

  default(value) {
    this._default = value;

    return this;
  }

  deprecated(options) {
    this._deprecated = options;

    return this;
  }

  getQueryOperations(query) {
    return {
      [operations.IS]: declareOperation(query, this._name, operations.IS),
      [operations.IS_NOT]: declareOperation(query, this._name, operations.IS_NOT),
      [operations.IS_IN]: declareOperation(query, this._name, operations.IS_IN),
      [operations.IS_NOT_IN]: declareOperation(query, this._name, operations.IS_NOT_IN),
    }
  }
}

module.exports = SchemaField;
