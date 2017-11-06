'use strict';

class Query {
  constructor(modelObject) {
    Object.defineProperties(this, {
      _ilormSchema: {
        value: modelObject.getSchema()
      },
      _ilormConnector: {
        value: modelObject.getConnector()
      },
      _ilormQuery: {
        value: {}
      },
    });

    this._ilormSchema.properties.forEach(property => {
      Object.defineProperty(this, property, {
        value: this._ilormSchema.definition[property].getQueryOperations(this)
      });
    });

  }
}

module.exports = Query;
