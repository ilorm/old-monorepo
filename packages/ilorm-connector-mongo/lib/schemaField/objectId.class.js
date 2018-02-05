'use strict';

const { SchemaField, } = require('ilorm').Schema.Types;
const { ObjectId, } = require('mongodb');

/**
 * Class representing a ObjectId field
 */
class SchemaObjectId extends SchemaField {
  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {ObjectId} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    return new ObjectId(value);
  }
}

module.exports = SchemaObjectId;
