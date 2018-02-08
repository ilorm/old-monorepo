/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, declareModel, newModel, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/readData', () => {

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
          gender: 'M',
          weight: 78
        }, {
          firstName: 'Kathy',
          lastName: 'Pen-flame',
          gender: 'F',
          weight: 56
        }, {
          firstName: 'Benjamin',
          lastName: 'Martin',
          gender: 'M',
          weight: 89
        }
      ]);

    });

    after(async () => {
      await database.dropCollection('users');

      await mongoClient.close();
    });

    it('Could query Guillaume', async() => {
      class User extends newModel(modelFactoryParams) {}

      declareModel('users', User);

      const user = await User.aggregate()
        .group(stage => {
          stage.gender.asId();
          stage.total.sum(1);
        })
        .group()
        .execAndReturnOne();

      expect(user.firstName).to.be.equal('Guillaume');
      expect(user.lastName).to.be.equal('Daix');
      expect(user.gender).to.be.equal('M');
    });

  });
});




