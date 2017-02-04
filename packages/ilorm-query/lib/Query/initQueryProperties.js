'use strict';

const handleQueryOperator = require('./handleQueryOperator');
const handleUpdateOperator = require('./handleUpdateOperator');

function initQueryProperties ({query, schema}) {
  schema.keys.forEach(key => {
    Object.defineProperty(query, key, {
      enumerable: true,
      writable: false,
      configurable: false,
      value: {
        /** QUERY OPERATIONS **/
        associatedWith: (value) => {
          query.fields(key);
          return query.associatedWith(value);
        },
        notAssociatedWith: (value) => {
          query.fields(key);
          return query.notAssociatedWith(value);
        },
        is: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'EQUAL', value);
        },
        isNot: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'NOT_EQUAL', value);
        },
        isIn: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'IN', value);
        },
        isNotIn: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'NOT_IN', value);
        },
        min: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'MIN', value);
        },
        max: (value) => {
          query.fields(key);
          return handleQueryOperator(query, 'MAX', value);
        },
        between: (min, max) => {
          query.fields(key);
          return handleQueryOperator(query, 'BETWEEN', {min, max});
        },

        /** UPDATE OPERATIONS **/
        set: (value) => {
          query.fields(key);
          return handleUpdateOperator(query, 'SET', value);
        },
        inc: (value) => {
          query.fields(key);
          return handleUpdateOperator(query, 'INC', value);
        }
      }
    });
  });
}

module.exports = initQueryProperties;