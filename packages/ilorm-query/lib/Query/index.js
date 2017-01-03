/**
 * Created by guil_ on 30/12/2016.
 */

const Id = require('ilorm-model').Id;
const initQueryProperties = require('./initQueryProperties');

function injectDependencies ({ model, schema, Connector }) {


  class Query {
    constructor () {
      this.query = [];
      this.context = null;
      initQueryProperties({
        schema,
        query: this
      });
    }

    fields ( fields ) {
      this.context = fields;
      return this;
    }

    associatedWith ( param ) {
      if(this.context === null) {
        return this;
      }
      if(param instanceof Promise) {
        return this;
      }
      if(param instanceof Id) {
        return this;
      }
      if(param instanceof model.constructor) {
        return this;
      }
      throw new Error('associatedWith does not work with value: ' + param);
    }

    notAssociatedWith () {

    }

    find () {
      return Promise.all(this.query)
        .then(Connector.find);
    }
    findOne () {
      return Promise.all(this.query)
        .then(Connector.findOne);
    }
    count () {
      return Promise.all(this.query)
        .then(Connector.count);
    }
    remove () {
      return Promise.all(this.query)
        .then(Connector.remove);
    }
    removeOne () {
      return Promise.all(this.query)
        .then(Connector.removeOne);
    }
    update () {
      return Promise.all(this.query)
        .then(Connector.update);
    }
    updateOne () {
      return Promise.all(this.query)
        .then(Connector.updateOne);
    }
    multiple () {}
    stream () {
      return Promise.all(this.query)
        .then(Connector.stream);
    }

  }



  return Query;
}

module.exports = injectDependencies;