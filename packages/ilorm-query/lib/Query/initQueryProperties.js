'use strict';

const handleOperator = require('./handleOperator');

function initQueryProperties ({query, schema}) {

  schema.keys.forEach(key => {
    Object.defineProperty(query, key, {
      enumerable: true,
      writable: false,
      configurable: false,
      value: {
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
          return handleOperator(query, 'EQUAL', value);
        },
        isNot: (value) => {
          query.fields(key);
          return handleOperator(query, 'NOT_EQUAL', value);
        },
        min: (value) => {
          query.fields(key);
          return handleOperator(query, 'MIN', value);
        },
        max: (value) => {
          query.fields(key);
          return handleOperator(query, 'MAX', value);
        },
        between: (min, max) => {
          query.fields(key);
          return handleOperator(query, 'BETWEEN', {min, max});
        }
      }
    });
  });
}

module.exports = initQueryProperties;