/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, ObjectID, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, declareModel, newModel, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/referenceQuery', () => {

    let mongoClient;
    let database;
    let newModelParams;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');


      ilorm.use(ilormMongo);

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
        gender: Schema.string().required()
      });

      const invoiceSchema = new Schema({
        user: Schema.reference('users').required(),
        amount: Schema.number().required(),
      });

      const MongoConnector = ilormMongo.fromClient(database);

      newModelParams = {
        users: {
          name: 'users',
          schema: userSchema,
          connector: new MongoConnector({
            collectionName: 'users',
          }),
        },
        invoices: {
          name: 'invoices',
          schema: invoiceSchema,
          connector: new MongoConnector({
            collectionName: 'invoices',
          }),
        },
      };

      const benjaminId = new ObjectID();

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
          _id: benjaminId,
          firstName: 'Benjamin',
          lastName: 'Martin',
          gender: 'M'
        }
      ]);

      await database.collection('invoices').insertMany([
        {
          user: benjaminId,
          amount: 400
        }
      ]);
    });

    after(async () => {
      await database.dropCollection('users');
      await database.dropCollection('invoices');

      await mongoClient.close();
    });

    it('Could query invoice', async() => {
      class User extends newModel(newModelParams.users) {}
      class Invoice extends newModel(newModelParams.invoices) {}

      declareModel(User);
      declareModel(Invoice);

      const userQuery = User.query()
        .firstName.is('Benjamin');

      const invoice = await Invoice.query()
        .linkedWith(userQuery)
        .findOne();

      expect(invoice.amount).to.be.equal(400);
    });

  });
});




