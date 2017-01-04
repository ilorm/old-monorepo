/**
 * Created by guil_ on 30/12/2016.
 */

const initQueryProperties = require('./initQueryProperties');

function injectDependencies ({ model, schema, modelsMap, Id, connector }) {


  class Query {
    constructor () {
      this.query = [];
      this.update = [];
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
        param.model.__ilorm__name
        param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id
        }));
        return this;
      }
      if(param instanceof model.constructor) {
        param.__ilorm__name
        param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id
        }));
        return this;
      }
      throw new Error('associatedWith does not work with value: ' + param);
    }

    notAssociatedWith () {

    }

    find () {
      return Promise.all(this.query)
        .then(connector.find);
    }
    findOne () {
      return Promise.all(this.query)
        .then(connector.findOne);
    }
    count () {
      return Promise.all(this.query)
        .then(connector.count);
    }
    remove () {
      return Promise.all(this.query)
        .then(connector.remove);
    }
    removeOne () {
      return Promise.all(this.query)
        .then(connector.removeOne);
    }
    update () {
      return Promise.all([
        this.query,
        this.update
      ])
        .then(([query, update]) => connector.update({query, update}));
    }
    updateOne () {
      return Promise.all([
        this.query,
        this.update
      ])
        .then(([query, update]) => connector.updateOne({query, update}));
    }
    multiple () {}
    stream () {
      return Promise.all(this.query)
        .then(connector.stream);
    }

  }



  return Query;
}

module.exports = injectDependencies;