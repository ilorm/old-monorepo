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
    await this.prepareQuery();

    const Model = this[fields.MODEL];
    const rawResult = await this[fields.CONNECTOR].findOne(this);

    return Model.instantiate(rawResult);
  }

  /**
   * Find one or more instance
   * @returns {Array<Model>} Return an array of instance linked with the model
   */
  async find() {
    await this.prepareQuery();

    const Model = this[fields.MODEL];
    const rawResultList = await this[fields.CONNECTOR].find(this);

    return rawResultList.map(rawResult => Model.instantiate(rawResult));
  }

  /**
   * Count instance which match the query
   * @returns {Promise.<Number>} The number of instance which match the query
   */
  count() {
    return this.runQuery('count');
  }

  /**
   * Remove instance which match the query
   * @returns {*} TODO
   */
  remove() {
    return this.runQuery('remove');
  }

  /**
   * Remove one instance which match the query
   * @returns {*} TODO
   */
  removeOne() {
    return this.runQuery('removeOne');
  }

  /**
   * Update one or more element which match the query, with the current update state
   * @returns {*} TODO
   */
  update() {
    return this.runUpdate('update');
  }

  /**
   * Update one element which match the query, with the current update state
   * @returns {*} TODO
   */
  updateOne() {
    return this.runUpdate('updateOne');
  }

  /**
   * Run specific query operation on the current query
   * @param {String} connectorOperation The operation to run
   * @returns {Promise.<*>} The result of the operation
   */
  async runQuery(connectorOperation) {
    await this.prepareQuery();

    return this[fields.CONNECTOR][connectorOperation](this);
  }

  /**
   * Run specific update operation on the current query
   * @param {String} connectorOperation The operation to run
   * @returns {Promise.<*>} The result of the operation
   */
  async runUpdate(connectorOperation) {
    await this.prepareQuery();
    await this.prepareUpdate();

    return this[fields.CONNECTOR][connectorOperation](this);
  }

  /**
   * Helper to convert ilorm query object to query on the Connector side
   * @param {Function} onOr This function will be called if the user have calling an or on this query
   * @param {Function} onOperator This function will be called per every key operator value combination
   * @returns {void} Return nothing
   */
  queryBuilder({ onOr, onOperator, }) {
    if (onOr) {
      if (this[fields.QUERY_OR]) {
        onOr(this[fields.QUERY_OR]);
      }
    }

    if (onOperator) {
      const query = this[fields.QUERY];

      for (const key of Object.keys(query)) {
        for (const operator of Object.keys(query[key])) {
          const value = query[key][operator];

          onOperator(key, operator, value);
        }
      }
    }
  }

  /**
   * Helper to convert ilorm query object to query on the Connector side
   * @param {Function} onOperator This function will be called per every key operator value combination
   * @returns {void} Return nothing
   */
  updateBuilder({ onOperator, }) {
    if (onOperator) {
      const query = this[fields.UPDATE];

      for (const key of Object.keys(query)) {
        for (const operator of Object.keys(query[key])) {
          const value = query[key][operator];

          onOperator(key, operator, value);
        }
      }
    }
  }

  /**
   * Utility method called before each query, could be used to change query behavior
   * @returns {void} Return nothing, only change the internal state of query
   */
  prepareQuery() {}

  /**
   * Utility method called before each update, could be used to change update behavior
   * @returns {void} Return nothing, only change the internal state of query
   */
  prepareUpdate() {}

  /**
   * Declare or field
   * @param {Function} handler be called back with a branch parameter using to create new branch
   * @returns {Query} Return current query to chain call
   */
  or(handler) {
    const orClause = [];

    /**
     * The branch function could be invoked to each OR branch you want to describe
     * @returns {Query} The query to use to explain what your branch do
     */
    const branch = () => {
      const branchQuery = new this.constructor();

      orClause.push(branchQuery);

      return branchQuery;
    };

    handler(branch);

    this[fields.QUERY_OR] = orClause;

    return this;
  }

  /**
   * Create a stream of data returned by the query on the database
   * @returns {Stream} A readable stream to manipulate resulting data
   */
  async stream() {
    await this.prepareQuery();

    const Model = this[fields.MODEL];
    const rawStream = await this[fields.CONNECTOR].stream(this);

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
