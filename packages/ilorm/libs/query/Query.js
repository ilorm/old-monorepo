/**
 * Created by guil_ on 30/12/2016.
 */

const Id = require('../models/Id');

function injectDependencies({ model, Connector }) {

  class Query {
    constructor() {
      this.query = [];
    }

    associatedWith( param, field ) {
      if(param instanceof Promise) {
        this.query.push(param);
        return this;
      }
      if(param instanceof Id) {

      }
      if(param instanceof model.constructor) {
      }
    }

    notAssociatedWith() {

    }

    exec() {

    }

    stream() {

    }
  }

  return Query;
}

module.exports = injectDependencies;