/**
 * Created by guil_ on 27/12/2016.
 */

const FieldType = require('./FieldType');

/**
 * Define a String field in your schema
 */
class FieldString extends FieldType {

  /**
   * Check if the given value is valid compared to the current field definition.
   * @param {String} value The value to check
   * @returns {boolean} Return true if the value is valid or false if it's not.
   */
  isValid(value) {
    return (!this.isRequired && value === undefined) || typeof value === 'string';
  }

}

module.exports = FieldString;
