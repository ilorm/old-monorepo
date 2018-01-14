const DEPRECIATED = Symbol('depreciated');

/**
 * Create SchemaFieldDepreciation this plugin add depreciation to schemaField
 * @param {SchemaField} SchemaField The schemaField to overload
 * @return {SchemaFieldDepreciation} Return a SchemaFieldDepreciation ready to use
 */
const injectSchemaField = SchemaField => class SchemaFieldDepreciation extends SchemaField {
  /**
   * Add depreciated attribute used to depreciated field
   */
  constructor() {
    super();
    this[DEPRECIATED] = null;
  }

  /**
   * Declare field as depreciated
   * Call this function set the field as depreciated, value will no be keep
   * TODO : Handle case to keep "old" field to keep old code functional
   * @param {Object} options define how the depreciation will work with this field
   * @return {schemaField} Return current element to chainable rules
   */
  depreciated(options) {
    this[DEPRECIATED] = options;

    return this;
  }

  /**
   * Init instance with depreciation system
   * @param {Model} instance The instance to init
   * @param {String} field The field to init
   * @returns {Mixed} The value initialized
   */
  async init(instance, field) {
    if (!this[DEPRECIATED]) {
      return super.init(instance, field);
    }

    const { newField, resolveField, } = this[DEPRECIATED];
    const oldValue = instance[field];
    const newValue = newField ? instance[newField] : undefined;

    if (resolveField) {
      await resolveField({
        oldValue,
        newValue,
      });

      return undefined;
    }

    if (newField && !newValue) {
      instance[newField] = oldValue;
    }

    return undefined;
  }
};

module.exports = injectSchemaField;
