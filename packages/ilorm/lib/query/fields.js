'use strict';

/**
 * Specific fields used by a Query Object
 * @type {{CONNECTOR: Symbol, QUERY: Symbol, SCHEMA: Symbol}}
 */
module.exports = {
  // The target connector of the query :
  CONNECTOR: Symbol('connector'),

  // The current query state (the query will be run on the connector) :
  QUERY: Symbol('query'),

  // The current update state (the update will be run on the connector) :
  UPDATE: Symbol('update'),

  // The schema associated with the query :
  SCHEMA: Symbol('schema'),

  // The linked model :
  MODEL: Symbol('model'),
};
