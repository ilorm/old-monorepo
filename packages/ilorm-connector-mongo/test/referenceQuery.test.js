/* eslint-disable */

const { expect, } = require('chai');
const { MongoClient, ObjectID, } = require('mongodb');
const ilorm = require('ilorm');

const ilormMongo = require('../index');

const DB_URL = 'mongodb://localhost:27017/ilorm';

const { Schema, declareModel, modelFactory, } = ilorm;

describe('ilorm-connector-mongodb', () => {
  describe.skip('test/referenceQuery', () => {

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

      const userGroupSchema = new Schema({
        user: Schema.reference('users').required(),
        group: Schema.reference('groups').required()
      });

      const groupSchema = new Schema({
        name: Schema.string().required(),
      });

      const MongoConnector = ilormMongo.fromClient(database);

      modelFactoryParams = {
        users: {
          name: 'users',
          schema: userSchema,
          connector: new MongoConnector({
            collectionName: 'users',
          }),
        },
        usersGroups: {
          name: 'usersGroups',
          schema: userGroupSchema,
          connector: new MongoConnector({
            collectionName: 'usersGroups',
          }),
        },
        groups: {
          name: 'groups',
          schema: groupSchema,
          connector: new MongoConnector({
            collectionName: 'groups',
          }),
        },
      };

      const benjaminId = new ObjectID();
      const groupOneId = new ObjectID();

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

      await database.collection('groups').insertMany([
        {
          _id: groupOneId,
          name: 'groupOneName'
        }, {
          name: 'groupTwoName'
        }
      ]);

      await database.collection('usersGroups').insertMany([
        {
          user: benjaminId,
          group: groupOneId
        }
      ]);
    });

    after(async () => {
      await database.dropCollection('users');
      await database.dropCollection('usersGroups');
      await database.dropCollection('groups');

      await mongoClient.close();
    });

    it('Could query Guillaume', async() => {
      class User extends modelFactory(modelFactoryParams.users) {}
      class UserGroup extends modelFactory(modelFactoryParams.usersGroups) {}
      class Group extends modelFactory(modelFactoryParams.groups) {}

      declareModel('users', User);
      declareModel('usersGroups', UserGroup);
      declareModel('groups', Group);

      const userQuery = User.query()
        .firstName.is('Benjamin');

      const group = await Group.query()
        .linkedWith(userQuery)
        .findOne();

      expect(group.name).to.be.equal('groupOneName');
    });

  });
});




