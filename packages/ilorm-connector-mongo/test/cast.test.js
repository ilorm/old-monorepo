/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, ObjectID, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/cast', () => {

    let mongoClient;
    let database;
    let User;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');


      ilorm.use(ilormMongo);

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
        isMale: Schema.boolean().required(),
        age: Schema.number().required()
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
          lastName: 12,
          isMale: 'true',
          age: '25'
        }
      ]);


      User = class User extends ilorm.newModel(modelFactoryParams) {}

      ilorm.declareModel(User);
    });

    after(async () => {
      await database.dropCollection('users');

      await mongoClient.close();
    });

    it('Could query Guillaume with good cast of field', async() => {
      const user = await User.query()
        .firstName.is('Guillaume')
        .findOne();

      expect(user.firstName).to.be.equal('Guillaume');
      expect(user.lastName).to.be.equal('12');
      expect(user.isMale).to.be.equal(true);
      expect(user.age).to.be.equal(25);
    });

    it('Could create instance with good cast of field', async() => {
      const user = new User();

      user.age = '12';
      user.isMale = '';
      user.lastName = 1;
      user.firstName = true;

      expect(user.firstName).to.be.equal('true');
      expect(user.lastName).to.be.equal('1');
      expect(user.isMale).to.be.equal(false);
      expect(user.age).to.be.equal(12);

    })

  });
});




