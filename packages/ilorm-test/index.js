/* eslint-disable */
'use strict';

const { MongoClient, } = require('mongodb');
const { schema, model, } = require('ilorm');
const MockConnector = require('ilorm-connector-mock')();
const MongoConnectorFactory = require('ilorm-connector-mongo');

const URL = '';

const userSchema = new schema.Schema({
  firstName: new schema.String().required(),
  lastName: new schema.String().required,
  age: new schema.Number().required(),
  gender: new schema.String(),
});

const User = new model.Model('user', userSchema, new MockConnector());

const invoiceSchema = new schema.Schema({
  amount: new schema.String().required(),
});

const invoice = new model.Model('invoice', invoiceSchema, new MockConnector());

User.query()
  .firstName.is('Guillaume')
  .findOne()
  .then(res => {
    console.log(res);
  })
  .catch(e => console.error(e));

invoice.query()
  .amount.min(300)
  .amount.inc(40)
  .update()
  .then(res => {
    console.log(res);
  })
  .catch(e => console.error(e));

class Woman extends User {}

Woman.defineConstraint()
  .gender.is('F');

Woman.query()
  .firstName.is('Pauline')
  .findOne()
  .then(res => {
    console.log(res);
  })
  .catch(e => console.error(e));

MongoClient.connect(URL, function(err, db) {

  const userSchema = new schema.Schema({
    first_name: new schema.String().required(),
    email: new schema.String().required(),
    last_name: new schema.String().required(),
    age: new schema.Number().required(),
    gender: new schema.String(),
  });

  const MongoConnector = MongoConnectorFactory({ db, });

  const User = new model.Model('users', userSchema, new MongoConnector({ collection: 'users', }));

  User.query()
    .email.is('guillaumedaix@free.fr')
    .find()
    .then(res => console.log(res))
    .catch(e => console.error(e));
});