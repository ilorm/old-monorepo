const Model = require('./model');
const Query = require('./query');
const Schema = require('./schema');
const Fields = require('./schemaField');

const finalLib = {
  Model,
  Query,
  Schema: Object.assign(Schema, Fields),
};

module.exports = finalLib;
