/**
 * Created by guil_ on 29/12/2016.
 */
const MongoQuery = require('./query/index');
const modelFactory = require('../model/model.factory');
const convertQueryToMongoQuery = require('./convertQueryToMongoQuery');
const convertUpdateToMongoUpdate = require('./convertUpdateToMongoUpdate');

/**
 * Inject your mongo db in the Mongo connector
 * @param {Object} db A valid mongo connection
 * @returns {MongoConnector} Return a mongo connector
 */
const injectDependencies = ({ db, }) => {
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
     * @param {Object|Object[]} docs The object you want to create in the database
     * @returns {*} The result of the operation
     */
    async create(docs) {
      const collection = await this.getCollection();

      return collection.insertMany(docs);
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    async find(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();
      const findResult = collection.find(mongoQuery);

      return findResult.toArray();
    }

    /**
     * Find one document from your database
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    async findOne(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.findOne(mongoQuery);
    }

    /**
     * Count the number of document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    async count(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.count(mongoQuery);
    }

    /**
     * Update one or more document who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} The number of document updated
     */
    async update({ query, update, }) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const mongoUpdate = convertUpdateToMongoUpdate(update);
      const collection = await this.getCollection();

      return collection.updateMany(mongoQuery, mongoUpdate);
    }

    /**
     * Update onedocument who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    async updateOne({ query, update, }) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const mongoUpdate = convertUpdateToMongoUpdate(update);
      const collection = await this.getCollection();

      return collection.findOneAndUpdate(mongoQuery, mongoUpdate);
    }

    /**
     * Remove one or document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    async remove(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.deleteMany(mongoQuery);
    }

    /**
     * Remove one document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    async removeOne(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.findOneAndDelete(mongoQuery);
    }

    /**
     * Create a stream object from the query
     * @param {Object} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    async stream(query) {
      const mongoQuery = convertQueryToMongoQuery(query);
      const collection = await this.getCollection();

      return collection.find(mongoQuery).stream();
    }

    /**
     * Return a query
     * @return {MongoQuery} The query object
     * @constructor
     */
    static Query() {
      return MongoQuery;
    }

    /**
     * Create a new MongoModel from the given params
     * @param {Object} params The input parameters to create the model
     * @returns {MongoModel} The result MongoModel
     */
    modelFactory(params) {
      return modelFactory(params);
    }
  }

  return MongoConnector;
};

module.exports = injectDependencies;
