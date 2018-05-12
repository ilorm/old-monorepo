const schemaFieldFactory = require('./schemaField.factory');
const queryFactory = require('./query.factory');
const modelFactory = require('./model.factory');

const { ALGOLIA_SCHEMA_FIELDS_OPTIONS, } = require('./fields');

/**
 * Create the plugin with a specific configurations
 * @return {Object} Return the plugin
 */
module.exports = {
  plugins: {
    core: {
      schemaFieldFactory,
      queryFactory,
      modelFactory,
    },
    schemaOptions: [
      ALGOLIA_SCHEMA_FIELDS_OPTIONS,
    ],
  },
};

