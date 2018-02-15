'use strict';

const modelMap = require('./models.map');
const { getModel, } = require('./model.class');

/**
 * Create a new Model class with the given parameter
 * @param {String|Symbol} name The name of the model
 * @param {Schema} schema The schema used by the model
 * @param {Connector} connector The connector used by the model
 * @param {Object} pluginsOptions Add special plugin configuration
 * @returns {Model} The new model to use in project
 */
const modelFactory = ({ name = Symbol('Model'), schema, connector, pluginsOptions = {}, }) => {

  /**
   * The InternalModel it's a class created dynamically in function of the schema, the connector and the name
   * given by the model.
   */
  class InternalModel extends getModel() {
    /**
     * Construct a new instance of the model
     * @param {Object} rawJson object to instantiate directly the data
     */
    constructor(rawJson) {
      super(rawJson);

      const instance = new Proxy(this, schema.getProxy());

      if (rawJson) {
        for (const property of Object.keys(rawJson)) {
          instance[property] = rawJson[property];
        }
      }

      return instance;
    }

    /**
     * Return the name of the model
     * @returns {String} The name of the model
     */
    static getName() {
      return name;
    }

    /**
     * Return the schema associated with the model
     * @returns {Schema} The schema of the model
     */
    static getSchema() {
      return schema;
    }

    /**
     * Return the connector associated with the model
     * @returns {Connector} The connector of the model
     */
    static getConnector() {
      return connector;
    }

    /**
     * Return the plugins configuration associated with the model
     * @returns {Object} The plugin options
     */
    static getPluginsOptions() {
      return pluginsOptions;
    }
  }

  const connectorModelParams = {
    name,
    schema,
    ParentModel: InternalModel,
  };
  const ConnectorModel = connector.modelFactory(connectorModelParams);

  modelMap.set(name, ConnectorModel);

  return ConnectorModel;
};

module.exports = modelFactory;
