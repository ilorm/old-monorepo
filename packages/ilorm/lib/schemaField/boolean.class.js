'use strict';

const schemaField = require('./schemaField.class');

/**
 * Class representing a Boolean field
 */
class BooleanField extends schemaField {
  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {Boolean} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    return Boolean(value);
  }
}

module.exports = BooleanField;
