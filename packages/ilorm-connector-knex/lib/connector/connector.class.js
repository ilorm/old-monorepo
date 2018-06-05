'use strict';

const applyQueryOnKnex = require('./applyQueryOnKnex');
const applyUpdateOnKnex = require('./applyUpdateOnKnex');
const modelFactory = require('../model/model.factory');
const queryFactory = require('../query/query.factory');
const { KNEX, } = require('../query/fields');
const initTable = require('./initTable');

/**
 * Generate a KnexConnector by injecting the knex instance
 * @param {Object} knex knex object
 * @return {KnexConnector} The resulting Connector
 */
const injectDb = ({ knex, }) => {

  /**
   * Class representing a ilorm connector binded with knex
   */
  class KnexConnector {
    /**
     * Bind current connector with the given table
     * @param {String} tableName The table name
     */
    constructor({ tableName, }) {
      this.tableName = tableName;
    }

    /**
     * Generate a knex targeting the current table
     * @returns {Object} Knex connector
     */
    getKnex() {
      return knex(this.tableName);
    }

    /**
     * Create one or more docs into the database.
     * @param {Object} items The object you want to create in the database
     * @returns {*} The result of the operation
     */
    create(items) {
      return this.getKnex().insert(items);
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    find(query) {
      return applyQueryOnKnex(query, query[KNEX]);
    }

    /**
     * Find one document from your database
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    findOne(query) {
      return applyQueryOnKnex(query, query[KNEX])
        .limit(1)
        .then(items => (items && items.length ? items[0] : null));
    }

    /**
     * Count the number of document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    count(query) {
      return applyQueryOnKnex(query, query[KNEX])
        .count('*');
    }

    /**
     * Update one or more document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} The number of document updated
     */
    update(query) {
      applyQueryOnKnex(query, query[KNEX]);

      return applyUpdateOnKnex(query, query[KNEX]);
    }

    /**
     * Update one document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    updateOne(query) {
      query[KNEX]
        .limit(1);

      applyQueryOnKnex(query, query[KNEX]);

      return applyUpdateOnKnex(query, query[KNEX]);
    }

    /**
     * Remove one or document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    remove(query) {
      applyQueryOnKnex(query, query[KNEX]);

      return query[KNEX].del();
    }

    /**
     * Remove one document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    removeOne(query) {
      query[KNEX]
        .limit(1);

      applyQueryOnKnex(query, query[KNEX]);

      return query[KNEX].del();
    }

    /**
     * Create a stream object from the query
     * @param {Query} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    stream(query) {
      return applyQueryOnKnex(query, query[KNEX])
        .stream();
    }

    /**
     * Create a new KnexModel from the given params
     * @param {Model} ParentModel The ilorm global Model used as parent of ModelConnector
     * @returns {KnexModel} The result KnexModel
     */
    modelFactory({ ParentModel, schema, }) {
      initTable({
        connector: this,
        knex,
        ParentModel,
        schema,
      });

      return modelFactory({
        ParentModel,
      });
    }

    /**
     * Create a new KnexQuery from the given params
     * @param {Query} ParentQuery The ilorm global Query used as parent of QueryConnector
     * @returns {KnexQuery} The result KnexQuery
     */
    queryFactory({ ParentQuery, }) {
      return queryFactory({ ParentQuery, });
    }



  }

  return KnexConnector;
};

module.exports = injectDb;
