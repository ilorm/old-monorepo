/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaNumber extends SchemaType {

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