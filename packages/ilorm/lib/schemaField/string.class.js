'use strict';

const schemaField = require('./schemaField.class');

/**
 * Class representing a String field
 */
class StringField extends schemaField {
  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {String} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    return String(value);
  }
}

module.exports = StringField;
