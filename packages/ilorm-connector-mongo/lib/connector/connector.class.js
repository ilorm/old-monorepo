/**
 * Created by guil_ on 29/12/2016.
 */
const modelFactory = require('../model/model.factory');
const queryFactory = require('../query/query.factory');
const convertQueryToMongoQuery = require('./convertQueryToMongoQuery');
const convertUpdateToMongoUpdate = require('./convertUpdateToMongoUpdate');

/**
 * Inject your mongo db in the Mongo connector
 * @param {Object} db A valid mongo connection
 * @returns {MongoConnector} Return a mongo connector
 */
const injectDependencies = ({ db, mongoClient, }) => {
  /**
   * The Mongo MongoConnector class
   */
  class MongoConnector {
    /**
     * Instantiate a new MongoConnector
     * @param {String} collection : The target collection name to use
     */
    constructor({ collectionName, }) {
      this.collectionName = collectionName;
    }

    /**
     * Get the raw database object to implement specific code
     * @returns {Object} The mongo db object
     */
    static getDatabase() {
      return db;
    }

    /**
     * Get a promise for the current collection.
     * @returns {Promise.<Collection>} The mongo collection
     */
    getCollection() {
      if (this.collection) {
        return this.collection;
      }

      this.collection = new Promise((resolve, reject) => {
        db.collection(this.collectionName, (err, mongoCollection) => {
          if (err) {
            return reject(err);
          }

          return resolve(mongoCollection);
        });
      });

      return this.collection;
    }

    /**
     * Create one or more docs into the database.
     * @param {Object} items The object you want to create in the database
     * @returns {*} The result of the operation
     */
    async create(items) {
      const instances = [].concat(items);
      const collection = await this.getCollection();

      const rawJson = await Promise.all(instances.map(doc => doc.getJson()));

      const { insertedIds, } = await collection.insertMany(rawJson);

      for (let docIndex = 0; docIndex < instances.length; docIndex++) {
        instances[docIndex]._id = insertedIds[docIndex];
      }

      return null;
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    async find(query) {
      return (await this.applyBasicQuery('find', query))
        .toArray();
    }

    /**
     * Find one document from your database
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    findOne(query) {
      return this.applyBasicQuery('findOne', query);
    }

    /**
     * Count the number of document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    count(query) {
      return this.applyBasicQuery('count', query);
    }

    /**
     * Prepare update by converting raw query to mongo query, and raw update to mongo update
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {{query: ({}|{$and}|*), update: ({}|*)}} The query and update you want to run
     */
    prepareUpdate(query) {
      return {
        queryResults: convertQueryToMongoQuery(query),
        mongoUpdate: convertUpdateToMongoUpdate(query),
      };
    }

    /**
     * Update one or more document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} The number of document updated
     */
    update(query) {
      return this.runUpdate('updateMany', query);
    }

    /**
     * Update one document who match query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    updateOne(query) {
      return this.runUpdate('findOneAndUpdate', query);
    }

    /**
     * Run specific update operator on linked collection
     * @param {String} operator function to run on the collection
     * @param {Query} ilormQuery The ilorm query you want to run on your Database.
     * @returns {Promise.<*>} Return operator result
     */
    async runUpdate(operator, ilormQuery) {
      const { queryResults: { mongoQuery, mongoOptions, }, mongoUpdate, } = this.prepareUpdate(ilormQuery);
      const collection = await this.getCollection();

      return collection[operator](mongoQuery, mongoUpdate, mongoOptions);
    }

    /**
     * Apply basic query with the given mongo function
     * @param {String} mongoOperation The name of the operation to invoke on the mongo collection
     * @param {Query} ilormQuery The ilorm query you want to run on your Database.
     * @returns {Promise} Return mixed result based on the Mongo operation
     */
    async applyBasicQuery(mongoOperation, ilormQuery) {
      const { mongoQuery, mongoOptions, } = convertQueryToMongoQuery(ilormQuery);
      const collection = await this.getCollection();

      return collection[mongoOperation](mongoQuery, mongoOptions);
    }

    /**
     * Remove one or document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    remove(query) {
      return this.applyBasicQuery('deleteMany', query);
    }

    /**
     * Remove one document who match the query
     * @param {Query} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    removeOne(query) {
      return this.applyBasicQuery('findOneAndDelete', query);
    }

    /**
     * Create a stream object from the query
     * @param {Query} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    async stream(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.find(mongoQuery).stream();
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

    /**
     * Close mongoClient connection, when applicable.
     * @returns {void}
     */
    static close() {
      if (mongoClient) {
        mongoClient.close();
      }
    }
  }

  return MongoConnector;
};

module.exports = injectDependencies;
