'use strict';

const operations = require('../query/operations');
const declareOperation = require('./helpers/declareOperation');
const SchemaField = require('./schemaField.class');

class Date extends SchemaField {

  getQueryOperations(query) {
    const queryOperations = super.getQueryOperations(query);

    queryOperations[operations.BETWEEN] = declareOperation(query, this._name, operations.BETWEEN);
    queryOperations[operations.MIN] = declareOperation(query, this._name, operations.MIN);
    queryOperations[operations.MAX] = declareOperation(query, this._name, operations.MAX);

    return queryOperations;
  }
}

module.exports = Date;
