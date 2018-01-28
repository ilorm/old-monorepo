const schemaField = require('./schemaField.factory');

/**
 * Create the plugin with a specific configurations
 * @return {Object} Return the plugin
 */
module.exports = {
  plugins: {
    core: {
      schemaField,
    },
  },
};

