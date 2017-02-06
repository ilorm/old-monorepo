/**
 * Created by guil_ on 27/12/2016.
 */

const FieldType = require('./FieldType');

/**
 * Define a field number
 */
class FieldNumber extends FieldType {

  /**
   * Defined the minimal value acceptable in your data before throwing an exception.
   * @param {Number} minValue The minimal value accepted.
   * @returns {FieldNumber} Return the current field for chained definition
   */
  min(minValue) {
    this.minValue = minValue;

    return this;
  }

  /**
   * Defined the maximal value acceptable in your data before throwing an exception.
   * @param {Number} maxValue The maximal value accepted.
   * @returns {FieldNumber} Return the current field for chained definition
   */
  max(maxValue) {
    this.maxValue = maxValue;

    return this;
  }

  /**
   * Defined the minimal and maximal value acceptable in your data before throwing an exception.
   * @param {Number} minValue The minimal value accepted.
   * @param {Number} maxValue The maximal value accepted.
   * @returns {FieldNumber} Return the current field for chained definition
   */
  between(minValue, maxValue) {
    this.minValue = minValue;
    this.maxValue = maxValue;

    return this;
  }

  /**
   * Check if the given value is valid compared to the current field definition.
   * @param {String} value The value to check
   * @returns {boolean} Return true if the value is valid or false if it's not.
   */
  isValid(value) {
    const isTypeUndefined = (!this.isRequired && value === undefined);
    const isNumber = typeof value === 'number';
    const isConditionMaxValid = (!this.maxValue || this.maxValue > value);
    const isConditionMinValid = (!this.minValue || this.minValue < value);

    return isTypeUndefined || (isNumber && isConditionMaxValid && isConditionMinValid);
  }

}

module.exports = FieldNumber;
