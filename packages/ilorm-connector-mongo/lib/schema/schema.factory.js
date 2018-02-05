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
   * @param {Object} childSchema The child schema to use
   * @returns {ArrayField} return an Array field
   */
  static array(childSchema) {
    return new ArrayField(childSchema);
  }

  /**
   * Instantiate an Map field
   * @param {Object} childSchema The child schema to use
   * @returns {MapField} return an Map field
   */
  static map(childSchema) {
    return new MapField(childSchema);
  }

  /**
   * Instantiate an Object field
   * @param {Object} childSchema The child schema to use
   * @returns {ObjectField} return an Object field
   */
  static object(childSchema) {
    return new ObjectField(childSchema);
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
