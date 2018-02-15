'use strict';

const { FIELDS, SORT_BEHAVIOR, OPERATIONS, } = require('ilorm-constants').QUERY;
const { LIMIT, QUERY, QUERY_OR, SELECT, SKIP, SORT, } = FIELDS;

/**
 * Bind query builder function to the queryClass
 * @param {BaseQuery} queryClass The query class to bind the function
 * @returns {Function} Return a query builder
 */
const bindQueryBuilder = queryClass => ({ onOr, onOperator, onOptions, onSelect, onSort, }) => {
  if (onOr) {
    if (queryClass[QUERY_OR]) {
      queryClass[QUERY_OR].forEach(onOr);
    }
  }

  if (onOptions) {
    onOptions({
      skip: queryClass[SKIP],
      limit: queryClass[LIMIT],
    });
  }

  if (onSort) {
    const sort = queryClass[SORT];

    for (const key of Object.keys(sort)) {
      for (const operator of Object.keys(sort[key])) {
        onSort({
          key,
          order: operator === OPERATIONS.SORT_ASCENDING ? SORT_BEHAVIOR.ASCENDING : SORT_BEHAVIOR.DESCENDING,
        });
      }
    }
  }

  if (onSelect && queryClass[SELECT] && queryClass[SELECT].fields && queryClass[SELECT].fields.length > 0) {
    queryClass[SELECT].fields.forEach(field => onSelect({ field, }));
  }

  if (onOperator) {
    const query = queryClass[QUERY];

    for (const key of Object.keys(query)) {
      for (const operator of Object.keys(query[key])) {
        const value = query[key][operator];

        onOperator(key, operator, value);
      }
    }
  }
};

module.exports = bindQueryBuilder;
