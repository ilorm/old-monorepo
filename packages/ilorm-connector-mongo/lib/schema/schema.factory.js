'use strict';

const ArrayField = require('../schemaField/array.class');
const MapField = require('../schemaField/map.class');
const ObjectField = require('../schemaField/object.class');
const ObjectIdField = require('../schemaField/objectId.class');

/**
 * Class schema
 * Instantiate a mongo schema
 * @param {Schema} Schema schema to extends
 * @returns {MongoSchema} The mongo schema to use
 */
const injectSchema = Schema => class MongoSchema extends Schema {

  /**
   * Constructor for Schema
   * Add a _id field if missing
   * @param {Object} schema The given schema
   */
  constructor(schema) {
    if (!schema._id) {
      schema._id = new ObjectIdField();
    }

    super(schema);
  }

  /**
   * Instantiate an Array field
   * @returns {ArrayField} return an Array field
   */
  static array() {
    return new ArrayField();
  }

  /**
   * Instantiate an Map field
   * @returns {MapField} return an Map field
   */
  static map() {
    return new MapField();
  }

  /**
   * Instantiate an Object field
   * @returns {ObjectField} return an Object field
   */
  static object() {
    return new ObjectField();
  }

  /**
   * Instantiate an objectId field
   * @returns {ObjectIdField} return an ObjectId field
   */
  static objectId() {
    return new ObjectIdField();
  }

};


module.exports = injectSchema;
