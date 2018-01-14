const modelFactory = require('../model/model.factory');
const queryFactory = require('../query/query.factory');
const convertQueryToSQLWhere = require('./convertQueryToSQLWhere');
const prepareSelect = require('./prepareSelect');
const prepareLimitOffset = require('./prepareLimitOffset');

/**
 * Inject your client PostgreSQL to the connector
 * @param {Object} client A valid PostgreSQL client
 * @returns {PostgreSQLConnector} Return a PostgreSQL connector
 */
const injectDependencies = ({ client, }) => {
  /**
   * The PostgreSQLConnector class
   */
  class PostgreSQLConnector {
    /**
     * Instantiate a new PostgreSQLConnector
     * @param {String} tableName : The target table name to use
     */
    constructor({ tableName, }) {
      this.tableName = tableName;
    }

    /**
     * Create one or more docs into the database.
     * @param {Object} docs The object you want to create in the database
     * @returns {*} The result of the operation
     */
    async create(docs) {

    }

    /**
     * Find one or more document into your PostgreSQL database.
     * @param {Object} ilormQuery The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    async find(ilormQuery) {
      const { query, values, } = convertQueryToSQLWhere(ilormQuery);

      const sqlQuery = prepareSelect(this.tableName) + query;

      const results = await client.query(sqlQuery, values);

      return results;
    }

    /**
     * Find one document from your database
     * @param {Object} ilormQuery The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    async findOne(ilormQuery) {
      const { query, values, } = convertQueryToSQLWhere(ilormQuery);

      const sqlQuery = prepareSelect(this.tableName) + query + prepareLimitOffset({ limit: 1 });

      const results = await client.query(sqlQuery, values);

      return results;
    }

    /**
     * Count the number of document who match the query
     * @param {Object} ilormQuery The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    async count(ilormQuery) {
      const { query, values, } = convertQueryToSQLWhere(ilormQuery);

      const sqlQuery = prepareSelect(this.tableName, 'COUNT(*)') + query;

      const results = await client.query(sqlQuery, values);

      return results;
    }

    /**
     * Update one or more document who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} The number of document updated
     */
    async update({ query, update, }) {

    }

    /**
     * Update one document who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    async updateOne({ query, update, }) {

    }

    /**
     * Remove one or document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    async remove(query) {

    }

    /**
     * Remove one document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    async removeOne(query) {

    }

    /**
     * Create a stream object from the query
     * @param {Object} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    async stream(query) {

    }

    /**
     * Create a new MongoModel from the given params
     * @param {Object} params The input parameters to create the model
     * @returns {MongoModel} The result MongoModel
     */
    modelFactory(params) {
      return modelFactory(params);
    }

    /**
     * Create a new MongoQuery from the given params
     * @param {Object} params The input parameters to create the Query
     * @returns {MongoQuery} The result MongoQuery
     */
    queryFactory(params) {
      return queryFactory(params);
    }
  }

  return PostgreSQLConnector;
};

module.exports = injectDependencies;
