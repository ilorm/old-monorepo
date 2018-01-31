'use strict';

const { ALGOLIA_SCHEMA_FIELDS_OPTIONS, } = require('./fields');

/**
 * Prepare object to be saved on aloglia
 * @param {Model} instance instance of the model to save
 * @returns {Object} Object ready to be saved
 */
const prepareAlgoliaSave = instance => {
  const schema = instance.constructor.getSchema();

  const schemaFields = schema.getFieldsAssociatedWithPlugin(ALGOLIA_SCHEMA_FIELDS_OPTIONS);
  const algoliaObject = {
    ObjectID: instance._id,
  };

  schemaFields.forEach(field => {
    algoliaObject[field] = instance[field];
  })

  return algoliaObject;
};

module.exports = prepareAlgoliaSave;
