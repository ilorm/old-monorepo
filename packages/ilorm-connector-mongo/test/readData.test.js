/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../lib');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, declareModel, modelFactory, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/insertData', () => {

    let mongoClient;
    let database;
    let modelFactoryParams;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');


      ilorm.use(ilormMongo);

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
        }, {
          firstName: 'Kathy',
          lastName: 'Pen-flame',
          gender: 'F'
        }, {
          firstName: 'Benjamin',
          lastName: 'Martin',
          gender: 'M'
        }
      ]);

    });

    after(async () => {
      await database.dropCollection('users');

      await mongoClient.close();
    });

    it('Could query Guillaume', async() => {
      class User extends modelFactory(modelFactoryParams) {}

      declareModel('users', User);

      const user = await User.query()
        .firstName.is('Guillaume')
        .findOne();

      expect(user.firstName).to.be.equal('Guillaume');
      expect(user.lastName).to.be.equal('Daix');
      expect(user.gender).to.be.equal('M');
    });

    it('Could query two users', async() => {
      class User extends modelFactory(modelFactoryParams) {}

      declareModel('users', User);

      const users = await User.query()
        .gender.is('M')
        .find();

      expect(users).to.be.a('array');
      expect(users.length).to.be.equal(2);
    });
  });
});




