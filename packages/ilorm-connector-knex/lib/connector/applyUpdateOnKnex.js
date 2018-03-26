'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;


/**
 * Convert a valid update ilorm query to an update mongo query.
 * @param {Query} query The ilorm query you want to convert
 * @param {Object} knex To apply query
 * @returns {Object} Return knex parameter to chain call
 */
function applyUpdateOnKnex(query, knex) {
  if (!query) {
    return knex;
  }


  query.updateBuilder({
    onOperator: (key, operator, value) => {
      if (operator === OPERATIONS.SET) {
        knex.update(key, value);
      } else {
        knex.increment(knex, value);
      }
    },
  });

  return knex;
}

module.exports = applyUpdateOnKnex;
