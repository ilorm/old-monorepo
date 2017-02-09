/**
 * Created by guil_ on 29/12/2016.
 */
const EventEmitter = require('events');
const MongoQuery = require('./MongoQuery/index');
const convertIlormQueryToMongoQuery = require('./convertIlormQueryToMongoQuery');
const convertIlormUpdateToMongoUpdate = require('./convertIlormUpdateToMongoUpdate');

/**
 * Inject your mongo db in the Mongo connector
 * @param {Object} db A valid mongo connection
 * @returns {MongoConnector} Return a mongo connector
 */
function injectDependencies({ db, }) {
  /**
   * The Mongo MongoConnector class
   */
  class MongoConnector {
    /**
     * Instantiate a new MongoConnector
     * @param {String} collection : The target collection name to use
     */
    constructor({ collection, }) {
      this.connectorEvent = new EventEmitter();

      db.collection(collection, (err, mongoCollection) => {
        if (err) {
          throw err;
        }
        this.collection = mongoCollection;
        this.connectorEvent.emit('collectionLoaded', collection);
      });
    }

    /**
     * Get a promise for the current collection.
     * @returns {Promise.<Collection>} The mongo collection
     */
    getCollection() {
      if (this.collection) {
        return Promise.resolve(this.collection);
      }

      return new Promise(resolve => {
        this.connectorEvent.on('collectionLoaded', resolve);
      });
    }

    /**
     * Create one or more docs into the database.
     * @param {Object|Object[]} docs The object you want to create in the database
     * @returns {*} The result of the operation
     */
    create(docs) {
      return this.getCollection().then(collection => collection.insertMany(docs));
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    find(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return new Promise((resolve, reject) => {
        this.getCollection().then(collection => collection.find(mongoQuery)
          .toArray((err, docs) => {
            if (err) {
              return reject(err);
            }

            return resolve(docs);
          }));
      });
    }

    /**
     * Find one document from your database
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    findOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return this.getCollection().then(collection => collection.findOne(mongoQuery));
    }

    /**
     * Count the number of document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    count(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return this.getCollection().then(collection => collection.count(mongoQuery));
    }

    /**
     * Update one or more document who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} The number of document updated
     */
    update({ query, update, }) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);
      const mongoUpdate = convertIlormUpdateToMongoUpdate(update);

      return this.getCollection().then(collection => collection.updateMany(mongoQuery, mongoUpdate));
    }

    /**
     * Update onedocument who match query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @param {Object} update The ilorm update you want to run on your Database.
     * @returns {*} Return true if a document was updated
     */
    updateOne({ query, update, }) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);
      const mongoUpdate = convertIlormUpdateToMongoUpdate(update);

      return this.getCollection().then(collection => collection.findOneAndUpdate(mongoQuery, mongoUpdate));
    }

    /**
     * Remove one or document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    remove(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return this.getCollection().then(collection => collection.deleteMany(mongoQuery));
    }

    /**
     * Remove one document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    removeOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return this.getCollection().then(collection => collection.findOneAndDelete(mongoQuery));
    }

    /**
     * Create a stream object from the query
     * @param {Object} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    stream(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return this.getCollection().then(collection => collection.find(mongoQuery).stream());
    }

    /**
     * Return a MongoQuery
     * @return {MongoQuery} The MongoQuery object
     * @constructor
     */
    static Query() {
      return MongoQuery;
    }
  }

  return MongoConnector;
}

module.exports = injectDependencies;
