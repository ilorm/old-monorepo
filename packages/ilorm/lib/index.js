'use strict';

const model = require('./model');
const { clear, use, } = require('./plugins');
const { getSchema, } = require('./schema');
const getFields = require('./schemaField');

const finalLib = {
  clear,
  declareModel: model.declareModel,
  newModel: model.factory,
  use,
};

// Dynamic access to finalLib.Schema used to create schema from a factory ecosystem (to use plugin) :
Object.defineProperty(finalLib, 'Schema', {
  get: () => {
    // Associate fields to Schema
    // Field could be accessed as a subpath of schema : Schema.SchemaField
    const Schema = Object.assign(getSchema(), getFields());

    return Schema;
  },
});

// Export final ilorm library
module.exports = finalLib;
