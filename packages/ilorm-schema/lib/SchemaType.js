/**
 * Created by guil_ on 27/12/2016.
 */

class SchemaType {
  constructor() {
    this.isRequired = false;
    this.defaultValue = undefined;
  }

  required() {
    this.isRequired = true;
    return this;
  }

  default(value) {
    this.defaultValue = value;
    return this;
  }

  isValid(value) {
    return !this.isRequired || value !== undefined;
  }

  initValue() {
    if(typeof(this.defaultValue) === 'function') {
      return this.defaultValue();
    }
    return this.defaultValue;
  }
}

module.exports = SchemaType;

