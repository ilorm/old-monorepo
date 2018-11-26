'use strict';

const { OPERATIONS, SORT_BEHAVIOR, } = require('ilorm-constants').QUERY;

const operatorFilterFactory = {
  [OPERATIONS.IS]: ({ key, value, item, }) => item[key] === value,
  [OPERATIONS.IS_NOT]: ({ key, value, item, }) => item[key] !== value,
  [OPERATIONS.IS_IN]: ({ key, value, item, }) => item[key].includes(value),
  [OPERATIONS.IS_NOT_IN]: ({ key, value, item, }) => !item[key].includes(value),
  [OPERATIONS.GREATER_THAN]: ({ key, value, item, }) => item[key] > value,
  [OPERATIONS.LOWER_THAN]: ({ key, value, item, }) => item[key] < value,
  [OPERATIONS.GREATER_OR_EQUAL_THAN]: ({ key, value, item, }) => item[key] >= value,
  [OPERATIONS.LOWER_OR_EQUAL_THAN]: ({ key, value, item, }) => item[key] <= value,
  [OPERATIONS.BETWEEN]: ({ key, value: { min, max, }, item, }) => item[key] > min && item[key] < max,
};

const ASCENDING = 1;
const DESCENDING = -1;

/**
 * Convert a valid inputQuery to a query
 * @param {Query} query The ilorm query you want to convert
 * @returns {Object} The mongo query
 */
function convertQueryToMemoryQuery(query) {
  /**
    Filter function
    @return {Boolean} Return to false to filter or true to not filter
   */
  let filter = () => true;

  /**
   * Map function
   * @param {Object} item The item to transform
   * @return {Object} The result
   */
  let map = item => item;

  // Sorting function
  let sort = null;

  const projection = [];

  if (!query) {
    return {
      filter,
      map,
      sort,
      options: null,
    };
  }

  let options = null;

  query.queryBuilder({
    onOptions: ({ skip, limit, }) => {
      options = {
        skip: skip || 0,
        limit,
      };
    },
    onOr: arrayOfQuery => {
      filter = item => {
        if (!filter(item)) {
          return false;
        }

        let isFiltered = false;

        arrayOfQuery.forEach(query => {
          const { filter, } = convertQueryToMemoryQuery(query);

          isFiltered = isFiltered || filter(isFiltered);
        });

        return isFiltered;
      };
    },
    onSelect: ({ field, }) => {
      projection.push(field);
    },
    onSort: ({ key, behavior, }) => {
      if (!sort) {
        sort = () => 0;
      }

      sort = (itemA, itemB) => {
        const sorting = sort(itemA, itemB);

        if (sorting !== 0) {
          return sorting;
        }
        if (itemA[key] === itemB[key]) {
          return 0;
        }

        if (itemA[key] > itemB[key]) {
          return behavior === SORT_BEHAVIOR.ASCENDING ? ASCENDING : DESCENDING;
        }

        return behavior === SORT_BEHAVIOR.ASCENDING ? DESCENDING : ASCENDING;
      };
    },
    onOperator: (key, operator, value) => {
      if (operatorFilterFactory[operator]) {
        filter = item => filter(item) && operatorFilterFactory[operator]({
          key,
          value,
          item,
        });

      } else {
        throw new Error(`connector.Memory: UNDEFINED OPERATOR : ${operator}`);
      }
    },
  });

  if (projection.length > 0) {
    map = item => {
      const inputItem = map(item);
      const outputItem = {};

      projection.forEach(field => {
        outputItem[field] = inputItem[field];
      });

      return outputItem;
    };
  }

  return {
    filter,
    map,
    sort,
    options,
  };

}

module.exports = convertQueryToMemoryQuery;
