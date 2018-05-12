/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/insertData - connectFromUrl', () => {

    let database;
    let MongoConnector;

    before(async () => {
      MongoConnector = await ilormMongo.fromUrl({
        database: 'ilorm',
        url: DB_URL,
      });

      database = MongoConnector.getDatabase();
      ilorm.use(ilormMongo);

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
      });

      const modelFactoryParams = {
        name: 'users',
        schema: userSchema,
        connector: new MongoConnector({
          collectionName: 'users',
        }),
      };

      class User extends ilorm.newModel(modelFactoryParams) {}

      ilorm.declareModel(User);

      // Create data :
      const guillaume = new User();
      guillaume.firstName = 'guillaume';
      guillaume.lastName = 'daix';

      await guillaume.save();


      // Create data :
      const benjamin = new User({
        firstName: 'benjamin',
        lastName: 'martin',
      });

      await benjamin.save();
    });

    after(async () => {
      await database.dropCollection('users');

      await MongoConnector.close();
    });

    it('Guillaume exists', async() => {
      const usersCollection = database.collection('users');

      const user = await usersCollection.findOne({ firstName: 'guillaume' });

      expect(user).to.be.a('object');
      expect(user.firstName).to.be.equal('guillaume');
      expect(user.lastName).to.be.equal('daix');
    });

    it('Benjamin exists', async() => {
      const usersCollection = database.collection('users');

      const user = await usersCollection.findOne({ firstName: 'benjamin' });

      expect(user).to.be.a('object');
      expect(user.firstName).to.be.equal('benjamin');
      expect(user.lastName).to.be.equal('martin');
    });
  });
});
