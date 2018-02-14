
const SchemaClass = require('../schema/schema.class');
const ModelClass = require('../model/model.class');
const QueryClass = require('../query/query.class');
const SchemaFieldClass = require('../schemaField/schemaField.class');

const CORE_PLUGINS = [
  'schema',
  'model',
  'query',
  'schemaField',
];

const CoreClass = {
  schema: SchemaClass,
  model: ModelClass,
  query: QueryClass,
  schemaField: SchemaFieldClass,
};

/**
 * Declare the use of a plugins
 * @param {Object} plugins The plugin part of the given module
 * @returns {null} Return nothing
 */
const use = ({ plugins, }) => {
  if (!plugins) {
    return null;
  }

  if (plugins.schemaOptions) {
    plugins.schemaOptions.forEach(option => SchemaClass.getSchema().declarePluginOption(option));
  }

  // Handle core plugins ;
  if (plugins.core) {
    CORE_PLUGINS.forEach(coreType => {
      if (plugins.core[coreType]) {
        const Class = CoreClass[coreType];

        Class.overload(plugins.core[coreType]);
      }
    });
  }

  return null;
};

/**
 * Internal utility method to remove all plugins from ilorm
 * @returns {void} returns nothing
 */
const clear = () => {
  SchemaClass.getSchema().clearPluginOption();
  CORE_PLUGINS.forEach(coreType => {
    const Class = CoreClass[coreType];

    Class.clear();
  });
};

module.exports = {
  clear,
  use,
};
