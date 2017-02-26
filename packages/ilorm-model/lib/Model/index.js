/**
 * Created by guil_ on 27/12/2016.
 */

const ilormPlugins = require('ilorm-plugins');
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
function injectDependencies({ name, modelsMap, schema, connector, }) {

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
        ilormPlugins.run('model.init', { schema, })
          .then(({ schema, }) => {
            schema.initValues(this);
          });
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
     * An internal function used to run the specific hook with the specitic parameter
     * @param {String} [actionPluginName] The action plugin called before and after running the hook
     * @param {String} hookName The hook to run before running the action
     * @param {Object} hookParameters Parameters given to the hook and the running action
     * @return {Promise.<TResult>|*} Final result of the action
     */
    runHook({ actionPluginName, hookName, hookParameters, }) {
      const actionName = actionPluginName || `model.${hookName}`;
      const pluginsParameters = {
        hookName,
        hookParameters,
      };

      return ilormPlugins.run(`${actionName}.before`, pluginsParameters)
        .then(({ hookName, hookParameters, }) => this.hook[hookName].run(hookParameters))
        .then(result => ilormPlugins.run(`${actionName}.after`, {
          result,
          model: this,
        }));
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

        const hookParameters = {
          hookName: 'insert',
          hookParameters: {
            params: { obj: this, },
            operation: 'create',
            handler: connector.create,
          },
        };

        return this.runHook(hookParameters);
      }

      if (this.__ilormEditedFields.length === 0) {
        return Promise.resolve(this);
      }

      const hookParameters = {
        hookName: 'update',
        hookParameters: {
          params: {
            obj: this,
            editedFields: this.__ilormEditedFields,
          },
          operation: 'updateOne',
          handler: connector.updateOne,
        },
      };

      const result = this.runHook(hookParameters);

      this.__ilormEditedFields = [];

      return result;
    }

    /**
     * Remove the current instance of your model from the database.
     * @returns {*} Return a Promise with the result of the operation.
     */
    remove() {
      if (!this.__ilormIsNewObject) {
        const hookParameters = {
          hookName: 'remove',
          hookParameters: {
            params: { obj: this, },
            operation: 'remove',
            handler: connector.removeOne,
          },
        };

        return this.runHook(hookParameters);
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
      const hookParameters = {
        hookName: 'find',
        hookParameters: {
          params,
          operation: 'find',
          handler: connector.find,
          multiple: true,
        },
      };

      return this.runHook(hookParameters).then(results => (
        results.map(rawObj => new Model(rawObj))
      ));
    }

    /**
     * Apply an operation for find one instance of this model in the database.
     * @param {Object} params The param used to filter the query.
     * @returns {Promise.<Model>|*} Return the model found by the query
     */
    static findOne(params) {
      const hookParameters = {
        hookName: 'find',
        hookParameters: {
          params,
          operation: 'findOne',
          handler: connector.findOne,
        },
      };

      return this.runHook(hookParameters).then(result => new Model(result));
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
