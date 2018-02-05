'use strict';

const ilorm = require('ilorm');
const ilormMongo = require('ilorm-connector-mongo');
const ilormAlgolia = require('../index');

const { MongoClient, } = require('mongodb');

const { declareModel, newModel, } = ilorm;
const DB_URL = 'mongodb://localhost:27017/ilorm';

/**
 * Start scenario and init
 * Use mongodb as storage
 * Mock algolia
 * @param {Object} mockAlgoliaIndex Fake algolia index
 * @returns {Object} Return test using system
 */
const initScenario = async mockAlgoliaIndex => {
  const mongoClient = await MongoClient.connect(DB_URL);
  const database = await mongoClient.db('ilorm');

  // Declare use plugin :
  ilorm.use(ilormAlgolia);
  ilorm.use(ilormMongo);

  const { Schema, } = ilorm;

  const userSchema = new Schema({
    firstName: Schema.string().required(),
    lastName: Schema.string().required(),
  });

  const MongoConnector = ilormMongo.fromClient(database);

  const modelFactoryParams = {
    name: 'users',
    schema: userSchema,
    connector: new MongoConnector({
      collectionName: 'users',
    }),
    pluginsOptions: {
      algolia: {
        index: mockAlgoliaIndex,
      },
    },
  };

  const User = newModel(modelFactoryParams);

  declareModel('user', User);

  /**
   * Purge database after test
   * @returns {Promise.<void>} Purge database
   */
  const endScenario = async () => {
    await database.dropCollection('users');

    await mongoClient.close();
  };

  return {
    User,
    endScenario,
  };
};

module.exports = initScenario;
