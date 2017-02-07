/* eslint-disable */
'use strict';

const { schema, model, } = require('ilorm');
const MockConnector = require('ilorm-connector-mock')();

const userSchema = new schema.Schema({
  firstName: new schema.String().required(),
  lastName: new schema.String().required,
  age: new schema.Number().required(),
  gender: new schema.String(),
});

const User = new model.Model('user', userSchema, MockConnector);

const invoiceSchema = new schema.Schema({
  amount: new schema.String().required(),
});

const invoice = new model.Model('invoice', invoiceSchema, MockConnector);

User.query()
  .firstName.is('Guillaume')
  .findOne()
  .then(res => {
    console.log(res);
  });

invoice.query()
  .amount.min(300)
  .amount.inc(40)
  .update()
  .then(res => {
    console.log(res);
  });

class Woman extends User {}

Woman.defineConstraint()
  .gender.is('F');

Woman.query()
  .firstName.is('Pauline')
  .findOne()
  .then(res => {
    console.log(res);
  });
