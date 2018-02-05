/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { declareModel, newModel, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/manipulate array', () => {

    let mongoClient;
    let database;
    let modelFactoryParams;
    let Users;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');

      ilorm.use(ilormMongo);

      // Required to do after the use, to change Schema behavior
      const { Schema, } = require('ilorm');

      const userSchema = new Schema({
        alias: Schema.array({
          email: Schema.string().required(),
        }),
      });

      const MongoConnector = ilormMongo.fromClient(database);

      modelFactoryParams = {
        name: 'users',
        schema: userSchema,
        connector: new MongoConnector({
          collectionName: 'users',
        }),
      };

      Users = newModel(modelFactoryParams);

      declareModel('users', Users);
    });

    after(async () => {
      await database.dropCollection('users');

      await mongoClient.close();
    });

    it('Could insert object with map field', async() => {
      const item = {
        alias: [
          {
            email: 'smith@noemail.com',
          },
        ]
      };

      const smith = new Users(item);

      await smith.save();
    });

    it('Could update object with map field', async() => {
      const smith = await Users.query()
        .alias.email.is('smith@noemail.com')
        .alias.push({
          email: 'anothermail@fake.com',
        })
        .updateOne();
    });

    it('Could query object with map field', async() => {
      const smith = await Users.query()
        .alias.email.is('smith@noemail.com')
        .findOne();

      const smithJson = await smith.getJson();

      expect(smithJson.alias).to.be.deep.equal([
        {
          email: 'smith@noemail.com'
        }, {
          email: 'anothermail@fake.com'
        }
      ]);
    });
  });
});




