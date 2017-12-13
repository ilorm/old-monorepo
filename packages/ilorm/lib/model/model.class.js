'use strict';

const modelsMap = require('./models.map');

const isNew = Symbol('isNew');

/**
 * Class representing a Model
 */
class Model {
  /**
   * Construct a new instance of the model
   * @param {Object} rawJson object to instantiate directly the data
   */
  constructor(rawJson) {
    Object.defineProperties(this, {
      [isNew]: {
        value: true,
        writable: true,
      },
    });

    if (rawJson) {
      for (const property of Object.keys(rawJson)) {
        this[property] = rawJson[property];
      }
    }
  }

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
    const Class = modelsMap.get(this.getName(className));

    return new Class(rawObject);
  }

  /**
   * Get the instance of the model linked with the given id
   * @param {Connector} connector The connector to use to query the model instance
   * @param {ID} id The id of the target model
   * @return {Model} A model instance
   */
  static async getById(connector, id) {
    const rawInstance = await Model.getConnector(connector).getById(id);

    const instance = this.instantiate(rawInstance);

    instance[isNew] = false;

    return instance;
  }

  /**
   * Create a query targeting the model
   * @param {Query} Query inject the resulting query
   * @return {Query} return the query binded with the model
   */
  static query(Query) {
    return new Query();
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
   * @param {Connector} connector inject connector in function
   * @return {null} null
   */
  async save(connector) {
    if (this[isNew]) {
      const rawJson = await this.getJson();

      await Model.getConnector(connector).create(rawJson);

      this[isNew] = false;

      return this;
    }

    return this;
  }

  /**
   * Return json associated with the curent instance
   * @param {Schema} paramSchema inject the schema associated with the model
   * @return {Object} The json associated with the instance
   */
  getJson(paramSchema) {
    const schema = Model.getSchema(paramSchema);

    return schema.initInstance(this);
  }
}

module.exports = Model;
