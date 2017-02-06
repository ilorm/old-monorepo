/**
 * Created by guil_ on 27/12/2016.
 */

const Id = require('./../Id');
const initClassProperties = require('./initClassProperties');
const initInstanceProperties = require('./initInstanceProperties');

/**
 * Inject the dependencies in your Model class
 * @param {String} name The name of your model in your current project
 * @param {Object} modelsMap A map which store every model of your current project
 * @param {Schema} schema The schema used to define the data contained in your model
 * @param {Connector} Connector The connector used to store the data linked with your model
 * @returns {Model} Return the class you can instantiate for create new instance of your model
 */
function injectDependencies({ name, modelsMap, schema, Connector, }) {
  const connector = new Connector({
    name,
    schema,
  });

  /**
   * A Model class represent a data of your project
   */
  class Model {
    /**
     * Create a new instance of your model.
     * You can create a model form an object or with default value (if obj parameter is undefined)
     * @param {Object} [obj] The object if you want to create your model from an object
     */
    constructor(obj) {
      initInstanceProperties({
        obj,
        name,
        schema,
        instance: this,
      });

      if (!obj) {
        schema.initValues(this);
      }
    }

    /**
     * Save the current instance of your model in your database.
     * This action could update if the instance already exists.
     * This action could insert if the instance does not exists.
     * Or this action could do nothing, if the instance has not been edited, and if it's already exists in your
     * database.
     * @returns {*} Return the saved instance.
     */
    save() {
      if (this.__ilormIsNewObject) {
        this.__ilormIsNewObject = false;

        return connector.create({ obj: this, });
      }

      if (this.__ilormEditedFields.length === 0) {
        return Promise.resolve(this);
      }

      const result = connector.updateOne({
        obj: this,
        editedFields: this.__ilormEditedFields,
      });

      this.__ilormEditedFields = [];

      return result;
    }

    /**
     * Remove the current instance of your model from the database.
     * @returns {*} Return a Promise with the result of the operation.
     */
    remove() {
      if (!this.__ilorm__isNewObject) {
        return connector.removeOne({ obj: this, });
      }

      return Promise.resolve(true);
    }

    /**
     * Create an ilorm-query. The object is used to build query to found model
     * @returns {__ilorm__Query|{enumerable, writable, configurable, value}} The query object associated with your model
     */
    static query() {
      return new this.__ilorm__Query();
    }

    /**
     * Apply an operation for find one or more instance of this model in the database.
     * @param {Object} params The param used to filter the query.
     * @returns {Promise.<Model>|*} Return every model will match the query
     */
    static find(params) {
      return connector.find(params)
        .then(results => (
          results.map(rawObj => new Model(rawObj))
        ));
    }

    /**
     * Apply an operation for find one instance of this model in the database.
     * @param {Object} params The param used to filter the query.
     * @returns {Promise.<Model>|*} Return the model found by the query
     */
    static findOne(params) {
      return connector.findOne(params)
        .then(result => new Model(result));
    }

    /**
     * Create an Id object associated with this model
     * @param {*} id The id you want to create
     * @returns {Id} The Id created linked with your model
     */
    static id(id) {
      return new Id(this, id);
    }
  }

  initClassProperties({
    Model,
    modelsMap,
    name,
    schema,
    connector,
  });

  return Model;
}

module.exports = injectDependencies;
