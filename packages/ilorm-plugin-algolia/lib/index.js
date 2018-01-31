const schemaField = require('./schemaField.factory');
const { ALGOLIA_SCHEMA_FIELDS_OPTIONS, } = require('./fields');

/**
 * Create the plugin with a specific configurations
 * @return {Object} Return the plugin
 */
module.exports = {
  plugins: {
    core: {
      schemaField,
    },
    schemaOptions: [
      ALGOLIA_SCHEMA_FIELDS_OPTIONS,
    ],
  },
};

