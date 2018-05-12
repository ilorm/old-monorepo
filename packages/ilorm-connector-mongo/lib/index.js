'use strict';

const { MongoClient, } = require('mongodb');

const connector = require('./connector');
const schemaFactory = require('./schema.factory');

/**
 * Create the Connector from the given database
 * @param {MongoClient} database The database to use
 * @returns {Connector} The MongoDB connector object
 */
const fromClient = database => connector({ db: database, });

/**
 * Create the Connector from the given database
 * @param {Object} params Object encapsulating URL parameter (and optionally database name)
 * @returns {Connector} The MongoDB connector object
 */
const fromUrl = async ({ url, database = 'ilorm', }) => {
  const mongoClient = await MongoClient.connect(url);
  const db = await mongoClient.db(database);

  return connector({
    db,
    mongoClient,
  });
};

module.exports = {
  plugins: {
    core: {
      schemaFactory,
    },
  },
  fromClient,
  fromUrl,
};
