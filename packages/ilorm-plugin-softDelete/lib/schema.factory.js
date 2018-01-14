/**
 * Created by guil_ on 13/12/2017.
 */

const { Boolean, } = require('ilorm').Schema.Types;

/**
 * Create a SoftDeleteSchema class
 * @param {String} deletedField field used to handle softDelete
 * @param {Schema} Schema The schema to extends
 * @returns {SoftDeleteSchema} The new schema
 */
const injectSchema = ({ deletedField, }) => Schema => class SoftDeleteSchema extends Schema {

  /**
   * Constructor for Schema field
   * Add a isDeleted field (used to handle software delete).
   * @param {Object} schema The given schema
   */
  constructor(schema) {
    const isDeleted = new Boolean(); //eslint-disable-line

    isDeleted
      .default(false)
      .required();

    schema[deletedField] = isDeleted;

    super(schema);
  }
};

module.exports = injectSchema;
