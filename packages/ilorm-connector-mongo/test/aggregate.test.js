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

    it('Should run the aggregate and return one result', async() => {
      class User extends newModel(modelFactoryParams) {}

      declareModel('users', User);

      const result = await User.aggregate()
        .group(({ previous, next }) => {
          next._id.is(previous.gender);
          next.total.sum(1);
          next.weight.avg(previous.weight);
        })
        .group(({ previous, next }) => {
          next._id.is(null);
          next.total.sum(previous.total);
          next.weight.avg(previous.weight);
        })
        .execAndReturnOne();

      expect(result._id).to.be.equal(null);
      expect(result.total).to.be.equal(3);
      expect(result.weight).to.be.equal(69.75);
    });

  });
});




