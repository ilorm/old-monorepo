'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;


/**
 * Convert a valid update ilorm query to an update mongo query.
 * @param {Query} query The ilorm query you want to convert
 * @param {Object} knex To apply query
 * @returns {void} Return nothing
 */
function applyUpdateOnKnex(query, knex) {
  if (!query) {
    return;
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

}

module.exports = applyUpdateOnKnex;
