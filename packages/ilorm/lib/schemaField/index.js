'use strict';

const booleanFieldFactory = require('./boolean.factory');
const dateFieldFactory = require('./date.factory');
const numberFieldFactory = require('./number.factory');
const referenceFieldFactory = require('./reference.factory');
const { getSchemaField, } = require('./schemaField.class');
const stringFieldFactory = require('./string.factory');

/**
 * Generate fields from their factory
 * @returns {Object} Returns field init
 */
const getFields = () => {
  const SchemaField = getSchemaField();

  const BooleanField = booleanFieldFactory(SchemaField);
  const DateField = dateFieldFactory(SchemaField);
  const NumberField = numberFieldFactory(SchemaField);
  const ReferenceField = referenceFieldFactory(SchemaField);
  const StringField = stringFieldFactory(SchemaField);

  const factory = {
    boolean: () => new BooleanField(),
    date: () => new DateField(),
    number: () => new NumberField(),
    reference: () => new ReferenceField(),
    string: () => new StringField(),
  };

  factory.Types = {
    Boolean: BooleanField,
    Date: DateField,
    Number: NumberField,
    Reference: ReferenceField,
    SchemaField,
    String: StringField,
  };

  return factory;
};

module.exports = getFields;
