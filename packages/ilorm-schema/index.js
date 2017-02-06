/**
 * Created by guil_ on 27/12/2016.
 */

const Schema = require('./lib/Schema');
const Type = require('./lib/FieldType');
const Number = require('./lib/FieldNumber');
const String = require('./lib/FieldString');

const schema = {
  // Global schema file :
  Schema,

  // Parent class Type :
  Type,

  // Types :
  Number,
  String,

};

module.exports = schema;
