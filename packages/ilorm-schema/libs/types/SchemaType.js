/**
 * Created by guil_ on 27/12/2016.
 */

class SchemaType {
  constructor() {
    this.required = false;
    this.defaultValue = null;
  }

  required() {
    this.required = true;
    return this;
  }

  default(value) {
    this.defaultValue = value;
    return this;
  }

  isValid(value) {
    return !this.required || value !== undefined;
  }

  initValue() {
    if(typeof(this.defaultValue) === 'function') {
      return this.defaultValue();
    }
    return this.defaultValue;
  }
}

module.exports = SchemaType;

