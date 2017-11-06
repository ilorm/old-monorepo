'use strict';

const classIndex = require('./classIndex');
const Query = require('../query');

/**
 * Class representing a Model
 */
class Model {
  /**
   * Return the schema associated with the current model
   * @return {Schema} the schema associate with the model
   */
  static getSchema() {
    if (!this.SCHEMA) {
      throw new Error('Missing Schema binding with the Model');
    }

    return this.SCHEMA;
  }

  /**
   * Return the unique name of the model
   * @return {String} The model name
   */
  static getName() {
    if (!this.NAME) {
      throw new Error('Missing Name binding with the Model');
    }

    return this.NAME;
  }

  /**
   * Get the connector associate with the model
   * @return {Connector} The connector associate with the current model
   */
  static getConnector() {
    if (!this.CONNECTOR) {
      throw new Error('Missing Connector binding with the Model');
    }

    return this.CONNECTOR;
  }

  /**
   * Instantiate a raw json object to an instance representing the data model
   * @param {Object} rawObject the raw object to instantiate
   * @Returns {Model} The model instance
   */
  static instantiate(rawObject = {}) {
    return new classIndex[this.getName()](rawObject);
  }

  /**
   * Get the instance of the model linked with the given id
   * @param {ID} id The id of the target model
   * @return {Model} A model instance
   */
  static async getById(id) {
    return this.instantiate(await this.getConnector().getById(id));
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
