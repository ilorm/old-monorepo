'use strict';

const fields = require('./fields');
const operations = require('./operations');
const { Transform, } = require('stream');

/**
 * Class representing a queryBuilder
 * It's used by the framework to build query
 */
let Query = class Query {
  /**
   * Init the query object
   */
  constructor() {
    this.declareQueryFields();
  }

  /**
   * Init query fields
   * @returns {void} return nothing
   */
  declareQueryFields() {
    this[fields.SCHEMA].properties.forEach(property => {
      const propertyDefinition = this[fields.SCHEMA].definition[property];

      Object.defineProperty(this, property, { value: propertyDefinition.getQueryOperations(this), });
    });
  }

  /**
   * Declare field as linked with another query, model or ID.
   * @param {Model|Query} relatedElement Specify an element which be linked with the query result
   * @returns {Query} Return the query to make additional link or filters
   */
  linkedWith(relatedElement) { // eslint-disable-line

    return this;
  }

  /**
   * Find one instance from the query
   * @returns {Model} Return an instance of the linked model
   */
  async findOne() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    const Model = this[fields.MODEL];
    const rawResult = await this[fields.CONNECTOR].findOne(query);

    return Model.instantiate(rawResult);
  }

  /**
   * Find one or more instance
   * @returns {Array<Model>} Return an array of instance linked with the model
   */
  async find() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    const Model = this[fields.MODEL];
    const rawResultList = await this[fields.CONNECTOR].find(query);

    return rawResultList.map(rawResult => Model.instantiate(rawResult));
  }

  /**
   * Count instance which match the query
   * @returns {Number} The number of instance which match the query
   */
  async count() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    return this[fields.CONNECTOR].count(query);
  }

  /**
   * Remove instance which match the query
   * @returns {*} TODO
   */
  async remove() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    return this[fields.CONNECTOR].remove(query);
  }

  /**
   * Remove one instance which match the query
   * @returns {*} TODO
   */
  async removeOne() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    return this[fields.CONNECTOR].removeOne(query);
  }

  /**
   * Update one or more element which match the query, with the current update state
   * @returns {*} TODO
   */
  async update() {
    const [ query, update, ] = await Promise.all([
      await this.prepareQuery(this[fields.QUERY]),
      await this.prepareUpdate(this[fields.UPDATE]),
    ]);
    const updateParams = {
      query,
      update,
    };

    return this[fields.CONNECTOR].update(updateParams);
  }

  /**
   * Update one element which match the query, with the current update state
   * @returns {*} TODO
   */
  async updateOne() {
    const [ query, update, ] = await Promise.all([
      await this.prepareQuery(this[fields.QUERY]),
      await this.prepareUpdate(this[fields.UPDATE]),
    ]);
    const updateParams = {
      query,
      update,
    };

    return this[fields.CONNECTOR].updateOne(updateParams);
  }

  /**
   * Utility method called before each query, could be used to change query bahevior
   * @param {Object} query the input query
   * @returns {Object} The converted query
   */
  prepareQuery(query) {
    return query;
  }

  /**
   * Utility method called before each update, could be used to change update bahevior
   * @param {Object} update the input update
   * @returns {Object} The converted update
   */
  prepareUpdate(update) {
    return update;
  }

  /**
   * Create a stream of data returned by the query on the database
   * @returns {Stream} A readable stream to manipulate resulting data
   */
  async stream() {
    const query = await this.prepareQuery(this[fields.QUERY]);

    const Model = this[fields.MODEL];
    const rawStream = await this[fields.CONNECTOR].stream(query);

    const instantiateStream = new Transform({
      transform: (rawObject, encoding, callback) => {
        callback(null, Model.instantiate(rawObject));
      },
    });

    return rawStream.pipe(instantiateStream);
  }
};

/**
 * Overload query class by another (to plugin)
 * @param {Query} Class A new Query to replace the current one (plugin)
 * @returns {void} Return nothing
 */
const overload = Class => {
  Query = Class;
  Query.overload = overload;
  Query.FIELDS = fields;
  Query.OPERATIONS = operations;
};

Query.overload = overload;
Query.FIELDS = fields;
Query.OPERATIONS = operations;

module.exports = Query;
