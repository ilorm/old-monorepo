'use strict';

const model = require('./model');

const { getSchema, } = require('./schema');
const getFields = require('./schemaField');
const { clear, use, } = require('./plugins');

const finalLib = {
  clear,
  declareModel: model.declareModel,
  newModel: model.factory,
  use,
};

Object.defineProperty(finalLib, 'Schema', {
  get: () => {
    const Schema = Object.assign(getSchema(), getFields());

    return Schema;
  },
});

module.exports = finalLib;
