/**
 * Created by guil_ on 07/12/2017.
 */

const Model = require('./model.class');

/**
 * Create a new Model class with the given parameter
 * @param {String} name The name of the model
 * @param {Schema} schema The schema used by the model
 * @param {Connector} connector The connector used by the model
 * @returns {Model} The new model to use in project
 */
const modelFactory = ({ name, schema, connector, }) => {

  /**
   * The InternalModel it's a class created dynamically in function of the schema, the connector and the name
   * given by the model.
   */
  class InternalModel extends Model {
    /**
     * Return the name of the model
     * @returns {String} The name of the model
     */
    static getName() {
      return super.getName(name);
    }

    /**
     * Return the schema associated with the model
     * @returns {Schema} The schema of the model
     */
    static getSchema() {
      return super.getSchema(schema);
    }

    /**
     * Return the connector associated with the model
     * @returns {Connector} The connector of the model
     */
    static getConnector() {
      return super.getConnector(connector);
    }

    /**
     * Instantiate a specific object
     * @param {Object} rawObject The object to instantiate.
     * @returns {Model} Return the model object.
     */
    static instantiate(rawObject) {
      return super.instantiate(name, rawObject);
    }

    /**
     * Get a specific instance of the model by it's id
     * @param {ID} id The unique id of the instance
     * @returns {Model} The instance of the model
     */
    static getById(id) {
      return super.getById(connector, id);
    }

    /**
     * Save instance in database
     * Create it, if it's not exists
     * else, save it in database.
     * @returns {Model} Return instance.
     */
    save() {
      return super.save(connector);
    }

    /**
     * Return instance object
     * @return {Object} Return the object raw
     */
    getJson() {
      return super.getJson(schema);
    }
  }

  const connectorModelParams = {
    name,
    schema,
    ParentModel: InternalModel,
  };
  const ConnectorModel = connector.modelFactory(connectorModelParams);

  return ConnectorModel;
};

module.exports = modelFactory;
