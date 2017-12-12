const model = require('./model');
const Query = require('./query');
const Schema = require('./schema');
const Fields = require('./schemaField');
const { use, } = require('./plugins');

/**
 * Noop function
 * @return {void} Return nothing
 */

const finalLib = {
  Model: model.Class,
  modelFactory: model.factory,
  declareModel: model.declareModel,
  Query,
  Schema: Object.assign(Schema, Fields),
  use,
};

module.exports = finalLib;
