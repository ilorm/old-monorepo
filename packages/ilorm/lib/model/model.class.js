'use strict';

const modelsMap = require('./models.map');
const MainStream = require('./main.stream');
const queryFactory = require('../query/query.factory');

const { IS_NEW, } = require('./fields');

/**
 * Class representing a Model
 */
class BaseModel {
  /**
   * Construct a new instance of the model
*   */
  constructor() {
    Object.defineProperties(this, {
      [IS_NEW]: {
        value: true,
        writable: true,
      },
    });
  }

  /**
   * Get a duplex stream linked with the model
   * Could be use to write data from a stream into the linked database
   * Could be use to read all data from the linked database
   * @return {DuplexStream} The duplexstream to use
   */
  static stream() {
    return new MainStream({
      Model: this,
    });
  }

  /**
   * Return the schema associated with the current model
   * @param {Schema} schema the schema returned by the function
   * @return {Schema} the schema associate with the model
   */
  static getSchema() {
    throw new Error('Missing Schema binding with the Model');
  }

  /**
   * Return the unique name of the model
   * @return {String} The model name
   */
  static getName() {
    throw new Error('Missing Name binding with the Model');
  }

  /**
   * Get the connector associate with the model
   * @return {Connector} The connector associate with the current model
   */
  static getConnector() {
    throw new Error('Missing connector binding with the Model');
  }

  /**
   * Get the connector associate with the model
   * @return {Object} The plugins options associate with the current model
   */
  static getPluginsOptions() {
    throw new Error('Missing plugins options binding with the Model');
  }

  /**
   * Instantiate a raw json object to an instance representing the data model
   * @param {Object} rawObject the raw object to instantiate
   * @Returns {Model} The model instance
   */
  static instantiate(rawObject = {}) {
    const Class = modelsMap.get(this.getName());

    const instance = new Class(rawObject);

    instance[IS_NEW] = false;

    return instance;
  }

  /**
   * Get the instance of the model linked with the given id
   * @param {ID} id The id of the target model
   * @return {Model} A model instance
   */
  static async getById(id) {
    const rawInstance = await this.constructor.getConnector().getById(id);

    const instance = this.instantiate(rawInstance);

    instance[IS_NEW] = false;

    return instance;
  }

  /**
   * Create a query targeting the model
   * @return {Query} return the query binded with the model
   */
  static query() {
    const Query = queryFactory({
      model: modelsMap.get(this.getName()),
    });

    return new Query();
  }

  /**
   * Remove the current instance from the database
   * @return {null} null
   */
  remove() {
    if (this[IS_NEW]) {
      throw new Error('Can not remove an unsaved instance');
    }

    const query = this.getQueryPrimary();

    return this.constructor.getConnector().removeOne(query);
  }

  /**
   * Save the current instance in db
   * @return {null} null
   */
  async save() {
    if (this[IS_NEW]) {
      await this.constructor.getConnector().create(this);

      this[IS_NEW] = false;

      return this;
    }

    const query = this.getQueryPrimary();

    const update = {};

    await this.constructor.getConnector().updateOne(query, update);

    return this;
  }

  /**
   * Generate a query targeting the primary key of the instance
   * @returns {Object} Return the query to use to target the current instance
   */
  getQueryPrimary() {
    throw new Error('Missing overload by the connector model');
  }

  /**
   * Return json associated with the curent instance
   * @return {Object} The json associated with the instance
   */
  getJson() {
    const schema = this.constructor.getSchema();

    return schema.initInstance(this);
  }
}

let Model = BaseModel;

/**
 * Remove plugins from Model
 * @returns {void} return nothing
 */
const clear = () => {
  Model = BaseModel;
};

/**
 * Get current Model class
 * @returns {Model} Model class
 */
const getModel = () => Model;

/**
 * Overload model class by another (to plugin)
 * @param {Function} classFactory The class factory used to replace current model
 * @returns {void} Return nothing
 */
const overload = classFactory => {
  Model = classFactory(Model);
};

module.exports = {
  clear,
  getModel,
  overload,
};
