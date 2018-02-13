'use strict';

const model = require('./model');

const { getSchema, } = require('./schema');
const Fields = require('./schemaField');
const { use, } = require('./plugins');

const finalLib = {
  newModel: model.factory,
  declareModel: model.declareModel,
  use,
};

Object.defineProperty(finalLib, 'Schema', {
  get: () => {
    const Schema = Object.assign(getSchema(), Fields);

    return Schema;
  },
});

module.exports = finalLib;
