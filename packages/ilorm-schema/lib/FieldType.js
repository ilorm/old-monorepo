/**
 * Created by guil_ on 27/12/2016.
 */

/**
 * Abstract class used to define a field, could be used to create more field type.
 */
class FieldType {
  /**
   * Create a new field.
   * Init the value isRequired (check if the field is mandatory).
   * Init the value defaultValue (the value used to init an undefined field).
   */
  constructor() {
    this.isRequired = false;
    this.defaultValue = undefined;
  }

  /**
   * Set the field at mandatory
   * @returns {FieldType} Return the current field for chained definition
   */
  required() {
    this.isRequired = true;

    return this;
  }

  /**
   * Set the default value of the field
   * @param {*} value Set the default value of the field
   * @returns {FieldType} Return the current field for chained definition
   */
  default(value) {
    this.defaultValue = value;

    return this;
  }

  /**
   * Check if the given value is valid compared to the current field definition.
   * @param {String} value The value to check
   * @returns {boolean} Return true if the value is valid or false if it's not.
   */
  isValid(value) {
    return !this.isRequired || value !== undefined;
  }

  /**
   * Init the value of the field with it's default value.
   * @returns {*} Return the default value of the field
   */
  initValue() {
    if (typeof this.defaultValue === 'function') {
      return this.defaultValue();
    }

    return this.defaultValue;
  }
}

module.exports = FieldType;

