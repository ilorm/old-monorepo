const { Readable, } = require('stream');

const uuidv1 = require('uuid/v1');

const convertQueryToMemoryQuery = require('./convertQueryToMemoryQuery');
const convertUpdateToMemoryUpdate = require('./convertUpdateToMemoryUpdate');
const modelFactory = require('../model/model.factory');
const queryFactory = require('../query/query.factory');

/**
 * The Mongo MemoryConnector class
 */
class MemoryConnector {
  /**
   * Instantiate a new MemoryConnector
   */
  constructor() {
    this.storage = new Map();
  }

  /**
   * Create one or more docs into the database.
   * @param {Object} items The object you want to create in the database
   * @returns {*} The result of the operation
   */
  create(items) {
    [].concat(items).forEach(item => {
      item.id = item.id || uuidv1();
      this.storage.set(item.id, item);
    });

    return Promise.resolve();
  }

  /**
   * Find one or more document into your mongoDb database.
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {Promise} Every documents who match the query
   */
  find(query) {
    const memoryQuery = convertQueryToMemoryQuery(query);

    const results = [];

    for (const item of this.storage.values()) {
      if (memoryQuery.filter(item)) {
        results.push(memoryQuery.map(item));
      }
    }

    if (memoryQuery.sort) {
      results.sort(memoryQuery.sort);
    }

    if (memoryQuery.options) {
      const { options, } = memoryQuery;

      return Promise.resolve(results.slice(options.skip, options.limit));
    }

    return Promise.resolve(results);
  }

  /**
   * Find one document from your database
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {*|Promise.<Model>|*} The document first found
   */
  async findOne(query) {
    const results = await this.find(query);

    if (!results.length) {
      return null;
    }

    return results[0];
  }

  /**
   * Count the number of document who match the query
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {Promise.<Number>} The number of document found
   */
  async count(query) {
    const results = await this.find(query);

    return results.length;
  }

  /**
   * Update one or more document who match query
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {*} The number of document updated
   */
  async update(query) {
    const items = await this.find(query);

    const updateFunction = convertUpdateToMemoryUpdate(query);

    items.map(updateFunction);

    return null;
  }

  /**
   * Update one document who match query
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {*} Return true if a document was updated
   */
  async updateOne(query) {
    const item = await this.findOne(query);

    const updateFunction = convertUpdateToMemoryUpdate(query);

    updateFunction(item);

    return null;
  }


  /**
   * Remove one or document who match the query
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {Promise.<Number>} The number of document removed
   */
  async remove(query) {
    const results = await this.find(query);

    results.forEach(({ id, }) => this.storage.delete(id));

    return results.length;
  }

  /**
   * Remove one document who match the query
   * @param {Query} query The ilorm query you want to run on your Database.
   * @returns {Promise.<Boolean>} Return true if a document was removed
   */
  async removeOne(query) {
    const results = await this.find(query);

    if (!results.length) {
      return false;
    }

    this.storage.delete(results[0].id);

    return true;
  }

  /**
   * Create a stream object from the query
   * @param {Query} query The ilorm query you want to use to generate the stream
   * @returns {Stream} The stream associated with the query/
   */
  async stream(query) {
    const items = await this.find(query);

    const resultStream = new Readable({
      /**
       * Read data from the stream
       * @returns {void} Return nothing
       */
      read() {
        this.push(items.pop());
      },
    });

    return Promise.resolve(resultStream);
  }

  /**
   * Create a new MongoModel from the given params
   * @param {Model} ParentModel The ilorm global Model used as parent of ModelConnector
   * @returns {MongoModel} The result MongoModel
   */
  modelFactory({ ParentModel, }) {
    return modelFactory({ ParentModel, });
  }

  /**
   * Create a new MongoQuery from the given params
   * @param {Query} ParentQuery The ilorm global Query used as parent of QueryConnector
   * @returns {MongoQuery} The result MongoQuery
   */
  queryFactory({ ParentQuery, }) {
    return queryFactory({ ParentQuery, });
  }

}

module.exports = MemoryConnector;
