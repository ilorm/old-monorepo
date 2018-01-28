const ALGOLIA = Symbol('algolia');

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
    this[ALGOLIA] = null;
  }

  /**
   * Define this field as indexed on algolia
   *  @return {SchemaField} Return the field (to chainable definition)
   */
  algolia() {
    this[ALGOLIA] = true;

    return this;
  }
};

module.exports = injectSchemaField;
