'use strict';

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
   * Instantiate an objectId field
   * @returns {SchemaObjectId} return an ObjectId field
   */
  static objectId() {
    return new ObjectIdField();
  }
};


module.exports = injectSchema;
