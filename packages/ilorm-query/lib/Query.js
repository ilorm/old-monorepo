/**
 * Created by guil_ on 30/12/2016.
 */

const Id = require('ilorm-model').Id;

function injectDependencies ({ model, schema, Connector }) {


  class Query {
    constructor () {
      this.query = [];
      this.context = null;
    }

    runForEachContext (handler) {
      if(this.context === null) {
        throw new Error('Context missing');
      }

      this.context = [].concat(this.context);
      this.context.forEach(handler);
      this.context = null;
    }

    handleOperator (operator, value) {
      this.runForEachContext((context) => {
        this.query.push(
          Promise.resolve({
            operator,
            context,
            value
          })
        );
      });
      return this;
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

    is (value) {
      return this.handleOperator('EQUAL', value);
    }

    isNot (value) {
      return this.handleOperator('NOT_EQUAL', value);
    }

    min (value) {
      return this.handleOperator('MIN', value);
    }

    max (value) {
      return this.handleOperator('MAX', value);
    }

    between (min, max) {
      return this.handleOperator('BETWEEN', {min, max});
    }

    find () {
      return Promise.all(this.context)
        .then(Connector.find);
    }
    findOne () {
      return Promise.all(this.context)
        .then(Connector.findOne);
    }
    count () {
      return Promise.all(this.context)
        .then(Connector.count);
    }
    remove () {
      return Promise.all(this.context)
        .then(Connector.remove);
    }
    removeOne () {
      return Promise.all(this.context)
        .then(Connector.removeOne);
    }
    update () {
      return Promise.all(this.context)
        .then(Connector.update);
    }
    updateOne () {
      return Promise.all(this.context)
        .then(Connector.updateOne);
    }
    multiple () {}
    stream () {
      return Promise.all(this.context)
        .then(Connector.stream);
    }

  }

  schema.keys.forEach(key => {
    Object.defineProperty(Query.prototype, key, {
      enumerable: true,
      writable: false,
      configurable: false,
      value: {
        associatedWith: (value) => {
          this.fields(key);
          return this.associatedWith(value);
        },
        notAssociatedWith: (value) => {
          this.fields(key);
          return this.notAssociatedWith(value);
        },
        is: (value) => {
          this.fields(key);
          return this.is(value);
        },
        isNot: (value) => {
          this.fields(key);
          return this.isNot(value);
        },
        min: (value) => {
          this.fields(key);
          return this.min(value);
        },
        max: (value) => {
          this.fields(key);
          return this.max(value);
        },
        between: (min, max) => {
          this.fields(key);
          return this.between(min, max);
        }
      }
    });
  });

  return Query;
}

module.exports = injectDependencies;