const model = require('./model');
const Schema = require('./schema');
const Fields = require('./schemaField');
const { use, } = require('./plugins');

/**
 * Noop function
 * @return {void} Return nothing
 */

const finalLib = {
  newModel: model.factory,
  declareModel: model.declareModel,
  Schema: Object.assign(Schema, Fields),
  use,
};

module.exports = finalLib;
