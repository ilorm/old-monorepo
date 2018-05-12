'use strict';

const Ilorm = require('./ilorm.class');
const { getSchema, } = require('./schema');
const getFields = require('./schemaField');

// Dynamic access to finalLib.Schema used to create schema from a factory ecosystem (to use plugin) :
Object.defineProperty({}, 'Schema', {
  get: () => {
    // Associate fields to Schema
    // Field could be accessed as a subpath of schema : Schema.SchemaField
    const Schema = Object.assign(getSchema(), getFields());

    return Schema;
  },
});

// Export final ilorm library
module.exports = new Ilorm();
