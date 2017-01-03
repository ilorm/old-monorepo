/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');
const SchemaNumber = require('./SchemaNumber');
const SchemaString = require('./SchemaString');

class Schema {
  constructor(definition) {
    this.definition = definition;
    this.keys = [];
    for(let key in this.definition) {
      if(this.definition[key] instanceof SchemaType) {
        this.keys.push(key);
      }
    }

  }

  initValues(obj) {
    this.keys.forEach(key => {
      obj[key] = this.definition[key].initValue();
    });
    return obj;
  }

  isValid(value) {
    let isValid = true;
    this.keys.forEach(key => {
      isValid = isValid && this.definition[key].isValid(value[key]);
    });

    return isValid;
  }

  static String() {
    return new SchemaString();
  }

  static Number() {
    return new SchemaNumber();
  }
}

module.exports = Schema;