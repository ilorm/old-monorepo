const { ALGOLIA_SCHEMA_FIELDS_OPTIONS, } = require('./fields');

/**
 * Create SchemaFieldAlgolia this plugin add algolia to schemaField
 * @param {SchemaField} SchemaField The schemaField to overload
 * @return {SchemaFieldAlgolia} Return a SchemaFieldAlgolia ready to use
 */
const injectSchemaField = SchemaField => class SchemaFieldAlgolia extends SchemaField {
  /**
   * Add depreciated attribute used to depreciated field
   */
  constructor() {
    super();
    this[ALGOLIA_SCHEMA_FIELDS_OPTIONS] = null;
  }

  /**
   * Define this field as indexed on algolia
   *  @return {SchemaField} Return the field (to chainable definition)
   */
  algolia() {
    this[ALGOLIA_SCHEMA_FIELDS_OPTIONS] = true;

    return this;
  }
};

module.exports = injectSchemaField;
