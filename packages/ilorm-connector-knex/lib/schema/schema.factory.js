'use strict';

/**
 * Class schema
 * Instantiate a knex schema
 * @param {Schema} Schema schema to extends
 * @returns {KnexSchema} The knex schema to use
 */
const injectSchema = Schema => class KnexSchema extends Schema {};


module.exports = injectSchema;
