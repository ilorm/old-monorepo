/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

ilorm.use(ilormMongo);

const { Schema, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/readData', () => {

    let mongoClient;
    let database;
    let modelFactoryParams;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
        gender: Schema.string().required()
      });

      const MongoConnector = ilormMongo.fromClient(database);

      modelFactoryParams = {
        name: 'users',
        schema: userSchema,
        connector: new MongoConnector({
          collectionName: 'users',
        }),
      };

      await database.collection('users').insertMany([
        {
          firstName: 'Guillaume',
          lastName: 'Daix',
          gender: 'M'
        }
      ]);

    });

    after(async () => {
      await database.dropCollection('users');

      await mongoClient.close();
    });

    it('Could query only firstName and lastName', async() => {
      class User extends ilorm.newModel(modelFactoryParams) {}

      ilorm.declareModel(User);

      const user = await User.query()
        .firstName.is('Guillaume')
        .firstName.select()
        .lastName.select()
        .findOne();

      expect(user.firstName).to.be.equal('Guillaume');
      expect(user.lastName).to.be.equal('Daix');
      expect(user.gender).to.be.equal(undefined);
    });

    it('Could query only lastName', async() => {
      class User extends ilorm.newModel(modelFactoryParams) {}

      ilorm.declareModel(User);

      const lastName = await User.query()
        .firstName.is('Guillaume')
        .lastName.selectOnly()
        .findOne();

      expect(lastName).to.be.equal('Daix');
    });
  });
});




