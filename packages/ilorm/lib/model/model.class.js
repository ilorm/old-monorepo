'use strict';

const classIndex = require('./classIndex');
const Query = require('../query');

/**
 * Class representing a Model
 */
class Model {
  /**
   * Return the schema associated with the current model
   * @param {Schema} schema the schema returned by the function
   * @return {Schema} the schema associate with the model
   */
  static getSchema(schema) {
    if (!schema) {
      throw new Error('Missing Schema binding with the Model');
    }

    return schema;
  }

  /**
   * Return the unique name of the model
   * @param {String} name The name returned by the function
   * @return {String} The model name
   */
  static getName(name) {
    if (!name) {
      throw new Error('Missing Name binding with the Model');
    }

    return name;
  }

  /**
   * Get the connector associate with the model
   * @param {Connector} connector The connector returned by the function
   * @return {Connector} The connector associate with the current model
   */
  static getConnector(connector) {
    if (!connector) {
      throw new Error('Missing connector binding with the Model');
    }

    return connector;
  }

  /**
   * Instantiate a raw json object to an instance representing the data model
   * @param {String} className The name of the class to instantiate
   * @param {Object} rawObject the raw object to instantiate
   * @Returns {Model} The model instance
   */
  static instantiate(className, rawObject = {}) {
    const Class = classIndex.get(this.getName(className));

    return new Class(rawObject);
  }

  /**
   * Get the instance of the model linked with the given id
   * @param {Connector} connector The connector to use to query the model instance
   * @param {ID} id The id of the target model
   * @return {Model} A model instance
   */
  static async getById(connector, id) {
    const rawInstance = await this.getConnector(connector).getById(id);

    return this.instantiate(rawInstance);
  }

  /**
   * Create a query targeting the model
   * @return {Query} return the query binded with the model
   */
  static query() {
    return new Query(this);
  }

  /**
   * Remove an instance
   * TODO
   * @return {null} null
   */
  remove() {
    return null;
  }

  /**
   * Save the current instance in db
   * TODO
   * @return {null} null
   */
  save() {
    return null;
  }
}

module.exports = Model;
