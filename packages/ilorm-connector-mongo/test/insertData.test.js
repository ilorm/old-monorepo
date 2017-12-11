/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('./lib');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, declareModel, ModelFactory, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/insertData', () => {

    let database;

    before(async () => {
      database = await MongoClient.connect(DB_URL);

      ilorm.use(ilormMongo);

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
      });

      const MongoConnector = ilormMongo.fromClient(database);

      class User extends ModelFactory('users', userSchema, new MongoConnector('users')) {}

      declareModel('user', User);

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




