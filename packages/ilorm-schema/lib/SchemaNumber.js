/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaNumber extends SchemaType {

  min(min) {
    this.min = min;
    return this;
  }

  max(max) {
    this.max = max;
    return max;
  }

  isValid(value) {
    return typeof(value) === 'number' ||
      (!this.max || this.max > value) &&
      (!this.min || this.min < value) &&
      super.isValid(value);
  }

}

module.exports = SchemaNumber;