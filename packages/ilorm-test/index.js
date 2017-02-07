/* eslint-disable */
'use strict';

const { schema, model, } = require('ilorm');
const MockConnector = require('ilorm-connector-mock')();

const userSchema = new schema.Schema({
  firstName: new schema.String().required(),
  lastName: new schema.String().required,
  age: new schema.Number().required(),
});

const user = new model.Model('user', userSchema, MockConnector);

user.query()
  .firstName.is('Guillaume')
  .findOne()
  .then(res => {
    console.log(res);
  });

