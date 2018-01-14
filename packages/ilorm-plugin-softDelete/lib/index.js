/**
 * Created by guil_ on 13/12/2017.
 */

const schema = require('./schema.factory');
const query = require('./query.factory');

const DEFAULT_OPTIONS = {
  deletedField: 'isDeleted',
};

/**
 * Create the plugin with a specific configurations
 * @param {Object} paramsOptions Change the behavior of the plugin
 * @param {String} paramsOptions.deletedField field used to handle softDelete
 * @return {Object} Return the plugin
 */
module.exports = paramsOptions => {
  const options = Object.assign({}, paramsOptions, DEFAULT_OPTIONS);

  return {
    plugins: {
      core: {
        schema: schema(options),
        query: query(options),
      },
    },
  };
};

