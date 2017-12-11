const model = require('./model');
const Query = require('./query');
const Schema = require('./schema');
const Fields = require('./schemaField');
const { use, } = require('./plugins');

/**
 * Noop function
 * @return {void} Return nothing
 */
const declareModel = () => {};

const finalLib = {
  Model: model.Class,
  modelFactory: model.factory,
  declareModel,
  Query,
  Schema: Object.assign(Schema, Fields),
  use,
};

module.exports = finalLib;
