/**
 * Created by guil_ on 29/12/2016.
 */

const convertIlormQueryToMongoQuery = require('./convertIlormQueryToMongoQuery');
const convertIlormUpdateToMongoUpdate = require('./convertIlormUpdateToMongoUpdate');

/**
 * Inject your mongo db in the Mongo connector
 * @param {Object} db A valid mongo connection
 * @returns {MongoConnector} Return a mongo connector
 */
function injectDependencies({ db, }) {
  const collection = db.collection('target');

  /**
   * The Mongo MongoConnector class
   */
  class MongoConnector {
    /**
     * Create one or more docs into the database.
     * @param {Object|Object[]} docs The object you want to create in the database
     * @returns {*} The result of the operation
     */
    create(docs) {
      return collection.insertMany(docs);
    }

    /**
     * Find one or more document into your mongoDb database.
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise} Every documents who match the query
     */
    find(query) {
      return new Promise((resolve, reject) => {
        const mongoQuery = convertIlormQueryToMongoQuery(query);

        collection.find(mongoQuery)
          .toArray((err, docs) => {
            if (err) {
              return reject(err);
            }

            return resolve(docs);
          });
      });
    }

    /**
     * Find one document from your database
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {*|Promise.<Model>|*} The document first found
     */
    findOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.findOne(mongoQuery);
    }

    /**
     * Count the number of document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document found
     */
    count(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.count(mongoQuery);
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

      return collection.updateMany(mongoQuery, mongoUpdate);
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

      return collection.findOneAndUpdate(mongoQuery, mongoUpdate);
    }

    /**
     * Remove one or document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Number>} The number of document removed
     */
    remove(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.deleteMany(mongoQuery);
    }

    /**
     * Remove one document who match the query
     * @param {Object} query The ilorm query you want to run on your Database.
     * @returns {Promise.<Boolean>} Return true if a document was removed
     */
    removeOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.findOneAndDelete(mongoQuery);

    }

    /**
     * Create a stream object from the query
     * @param {Object} query The ilorm query you want to use to generate the stream
     * @returns {Stream} The stream associated with the query/
     */
    stream(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.find(mongoQuery).stream();
    }
  }

  return MongoConnector;
}

module.exports = injectDependencies;
