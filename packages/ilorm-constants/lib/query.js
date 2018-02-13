'use strict';

module.exports = {
  FIELDS: {
    // The target connector of the query :
    CONNECTOR: Symbol('connector'),

    // The current query state (the query will be run on the connector) :
    QUERY: Symbol('query'),

    // Current query state if you enable branch or :
    QUERY_OR: Symbol('queryOr'),

    // The current update state (the update will be run on the connector) :
    UPDATE: Symbol('update'),

    // The schema associated with the query :
    SCHEMA: Symbol('schema'),

    // The linked model :
    MODEL: Symbol('model'),

    // Declare element to ignore during the run of the query
    SKIP: Symbol('skip'),

    // Declare the number of element to query during the run of the query
    LIMIT: Symbol('limit'),

    // Declare Select specific fields
    SELECT: Symbol('select'),

    // Declare sort
    SORT: Symbol('sort'),
  },

  OPERATIONS: {
    // Basic operations :
    IS: 'is',
    IS_NOT: 'isNot',
    IS_IN: 'isIn',
    IS_NOT_IN: 'isNotIn',

    // Date or number :
    BETWEEN: 'between',
    GREATER_OR_EQUAL_THAN: 'greaterOrEqualThan',
    LOWER_OR_EQUAL_THAN: 'lowerOrEqualThan',
    GREATER_THAN: 'greaterThan',
    LOWER_THAN: 'lowerThan',

    // Reference :
    LINKED_WITH: 'linkedWith',

    // Update :
    SET: 'set',
    ADD: 'add',
  },
};
