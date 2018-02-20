/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { declareModel, newModel, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe('test/manipulate object', () => {

    let mongoClient;
    let database;
    let modelFactoryParams;
    let Books;

    before(async () => {

      mongoClient = await MongoClient.connect(DB_URL);
      database = await mongoClient.db('ilorm');

      ilorm.use(ilormMongo);

      // Required to do after the use, to change Schema behavior
      const { Schema, } = require('ilorm');

      const bookSchema = new Schema({
        display: Schema.object({
          title: Schema.string().required(),
          description: Schema.string(),
        }),
      });

      const MongoConnector = ilormMongo.fromClient(database);

      modelFactoryParams = {
        name: 'books',
        schema: bookSchema,
        connector: new MongoConnector({
          collectionName: 'books',
        }),
      };

      Books = newModel(modelFactoryParams);

      declareModel(Books);
    });

    after(async () => {
      await database.dropCollection('books');

      await mongoClient.close();
    });

    it('Could insert object with map field', async() => {
      const item = {
        display: {
          title: 'Le seigneur des anneaux',
        }
      };

      const lordOfTheRing = new Books(item);

      await lordOfTheRing.save();

    });

    it('Could update object with map field', async() => {
      const lordOfTheRing = await Books.query()
        .display.title.is('Le seigneur des anneaux')
        .display.description.set('Lord of the rings in french')
        .updateOne();
    });

    it('Could query object with map field', async() => {
      const lordOfTheRing = await Books.query()
        .display.title.is('Le seigneur des anneaux')
        .findOne();

      const jsonLordOfTheRing = await lordOfTheRing.getJson();

      expect(jsonLordOfTheRing.display).to.be.deep.equal({
        title: 'Le seigneur des anneaux',
        description: 'Lord of the rings in french',
      });
    });
  });
});




