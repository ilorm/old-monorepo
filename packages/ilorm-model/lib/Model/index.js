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
     * TODO: Handle new Model & save for default value
     * TODO: Handle custom constraint (overload isValid on schema)
     * Define constraint on a child class
     * @return {Query} The constraint applied to the child class
     */
    static defineConstraint() {
      if (!this.__ilormConstraint) {
        Object.defineProperty(this, '__ilormConstraint', {
          enumerable: false,
          writable: true,
          configurable: false,
          value: this.query(),
        });
      }

      return this.__ilormConstraint;
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

        return this.hook.insert.run({
          params: { obj: this, },
          operation: 'create',
          handler: connector.create,
        });
      }

      if (this.__ilormEditedFields.length === 0) {
        return Promise.resolve(this);
      }

      const result = this.hook.update.run({
        params: {
          obj: this,
          editedFields: this.__ilormEditedFields,
        },
        operation: 'updateOne',
        handler: connector.updateOne,
      });

      this.__ilormEditedFields = [];

      return result;
    }

    /**
     * Remove the current instance of your model from the database.
     * @returns {*} Return a Promise with the result of the operation.
     */
    remove() {
      if (!this.__ilormIsNewObject) {
        return this.hook.remove.run({
          params: { obj: this, },
          operation: 'remove',
          handler: connector.removeOne,
        });
      }

      return Promise.resolve(true);
    }

    /**
     * Create an ilorm-query. The object is used to build query to found model
     * @returns {Query|{enumerable, writable, configurable, value}} The query object associated with your model
     */
    static query() {
      return new this.__ilormQuery({ modelQuery: this.__ilormConstraint, });
    }

    /**
     * Apply an operation for find one or more instance of this model in the database.
     * @param {Object} params The param used to filter the query.
     * @returns {Promise.<Model[]>|*} Return every model will match the query
     */
    static find(params) {
      return this.hook.find.run({
        params,
        operation: 'find',
        handler: connector.find,
        multiple: true,
      }).then(results => (
        results.map(rawObj => new Model(rawObj))
      ));
    }

    /**
     * Apply an operation for find one instance of this model in the database.
     * @param {Object} params The param used to filter the query.
     * @returns {Promise.<Model>|*} Return the model found by the query
     */
    static findOne(params) {
      return this.hook.find.run({
        params,
        operation: 'findOne',
        handler: connector.findOne,
      }).then(result => new Model(result));
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
