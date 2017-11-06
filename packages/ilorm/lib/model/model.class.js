'use strict';

const classIndex = require('./classIndex');
const Query = require('../query').class;

class Model {
  static getSchema() {
    if(!this.SCHEMA) {
      throw new Error('Missing Schema binding with the Model');
    }
    return this.SCHEMA;
  }

  static getName() {
    if(!this.NAME) {
      throw new Error('Missing Name binding with the Model');
    }
    return this.NAME;
  }

  static getConnector() {
    if(!this.CONNECTOR) {
      throw new Error('Missing Connector binding with the Model');
    }
    return this.CONNECTOR;
  }

  static instantiate(rawObject) {
    return new classIndex[this.getName()];
  }

  static async getById(id) {
    return this.instantiate(await this.getConnector().getById(id));
  }

  static query() {
    return new Query(this);
  }

  async remove() {

  }

  async save() {

  }
}

module.exports = Model;
