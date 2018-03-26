'use strict';

const { OPERATIONS, SORT_BEHAVIOR, } = require('ilorm-constants').QUERY;

const operatorConversion = {
  [OPERATIONS.IS]: '=',
  [OPERATIONS.IS_NOT]: '<>',
  [OPERATIONS.IS_IN]: 'in',
  [OPERATIONS.IS_NOT_IN]: 'not in',
  [OPERATIONS.GREATER_THAN]: '>',
  [OPERATIONS.LOWER_THAN]: '<',
  [OPERATIONS.GREATER_OR_EQUAL_THAN]: '>=',
  [OPERATIONS.LOWER_OR_EQUAL_THAN]: '<=',
};

const ASCENDING = 'ASC';
const DESCENDING = 'DESC';

/**
 * Convert a valid inputQuery to a query
 * @param {Query} query The ilorm query you want to convert
 * @param {Object} knex To apply query
 * @returns {Object} Return knex parameter to chain call
 */
function applyQueryOnKnex(query, knex) {
  if (!query) {
    return knex;
  }
  const selectFields = [];

  query.queryBuilder({
    onOptions: ({ skip, limit, }) => {
      knex.limit(limit)
        .offset(skip);
    },
    onOr: arrayOfQuery => {
      arrayOfQuery.forEach(query => {
        knex.orWhere(function orClause() {
          arrayOfQuery(query, this); // eslint-disable-line
        });
      });
    },
    onSelect: ({ field, }) => {
      selectFields.push(field);
    },
    onSort: ({ key, behavior, }) => {
      knex.orderBy(key, behavior === SORT_BEHAVIOR.ASCENDING ? ASCENDING : DESCENDING);
    },
    onOperator: (key, operator, value) => {
      if (operator === OPERATIONS.BETWEEN) {
        knex.where(key, '>', value.min);
        knex.where(key, '<', value.max);

        return;
      }
      knex.where(key, operatorConversion[operator], value);
    },
  });

  if (selectFields.length > 0) {
    knex.select(...selectFields);
  }

  return knex;
}

module.exports = applyQueryOnKnex;
