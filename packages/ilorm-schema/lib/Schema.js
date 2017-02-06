/**
 * Created by guil_ on 27/12/2016.
 */

const FieldType = require('./FieldType');
const FieldNumber = require('./FieldNumber');
const FieldString = require('./FieldString');

/**
 * A schema is the way you represent your data.
 */
class Schema {
  /**
   * Declare a new schema
   * @param {Object} definition The definition of the schema you want to create
   */
  constructor(definition) {
    this.definition = definition;
    this.keys = [];
    for (const key in this.definition) {
      if (this.definition[key] instanceof FieldType) {
        this.keys.push(key);
      }
    }

  }

  /**
   * A method called on your schema with an object for init the object the default value defined in your schema.
   * @param {Object} obj The object you want to init the value
   * @returns {Object} The initialized object
   */
  initValues(obj) {
    this.keys.forEach(key => {
      obj[key] = this.definition[key].initValue();
    });

    return obj;
  }

  /**
   * Check if the object is a valid Object compared to your schema definition.
   * @param {Object} obj The object you want to check
   * @returns {boolean} return true if the object is valid compared to your schema
   */
  isValid(obj) {
    let isValid = true;

    this.keys.forEach(key => {
      isValid = isValid && this.definition[key].isValid(obj[key]);
    });

    return isValid;
  }

  /**
   * Return an String field to init a schema
   * @returns {FieldString} Return a FieldString instance
   * @constructor
   */
  static String() {
    return new FieldString();
  }

  /**
   * Return a Number field to init a schema
   * @returns {FieldNumber} Return a FieldNumber instance
   * @constructor
   */
  static Number() {
    return new FieldNumber();
  }
}

module.exports = Schema;
