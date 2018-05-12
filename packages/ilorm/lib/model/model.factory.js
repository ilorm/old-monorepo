'use strict';

/**
 * Create a new Model class with the given parameter
 * @param {Connector} connector The connector used by the model
 * @param {Ilorm} ilorm the current ilorm context instance
 * @param {String|Symbol} name The name of the model
 * @param {Object} pluginsOptions Add special plugin configuration
 * @param {Schema} schema The schema used by the model
 * @returns {Model} The new model to use in project
 */
const modelFactory = ({ connector, ilorm, name = Symbol('Model'), pluginsOptions = {}, schema, }) => {
  const { BaseModel, modelsIndex, } = ilorm;

  /**
   * The InternalModel it's a class created dynamically in function of the schema, the connector and the name
   * given by the model.
   */
  class InternalModel extends BaseModel {
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

  modelsIndex.set(name, ConnectorModel);

  schema.bindWithModel({
    InternalModel,
  });

  return ConnectorModel;
};

module.exports = modelFactory;
