/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaNumber extends SchemaType {

  /**
   * Set the min value accepted by the schema
   * @param {Number} minValue
   * @returns {SchemaNumber}
   */
  min(minValue) {
    this.minValue = minValue;
    return this;
  }

  max(maxValue) {
    this.maxValue = maxValue;
    return this;
  }

  between(minValue, maxValue) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    return this;
  }

  isValid(value) {
    return (!this.isRequired && value === undefined) || (typeof(value) === 'number' &&
      (!this.maxValue || this.maxValue > value) &&
      (!this.minValue || this.minValue < value));
  }

}

module.exports = SchemaNumber;