/**
 * Created by guil_ on 30/12/2016.
 */

const initQueryProperties = require('./initQueryProperties');

/**
 * Inject dependencies in Query class
 * @param {Object} model The model used by the Query
 * @param {Object} schema The schema used by the Query
 * @param {Object} modelsMap The models map used by the Query
 * @param {Object} Id The Id Object used by the Query
 * @param {Object} connector The DbConnector
 * @returns {Query} Query Class
 */
function injectDependencies({ model, schema, modelsMap, Id, connector }) {

  /**
   * Represent a Query at the database
   */
  class Query {
    constructor() {
      this.query = [];
      this.update = [];
      this.context = null;
      initQueryProperties({
        schema,
        query: this
      });
    }

    fields( fields ) {
      this.context = fields;

      return this;
    }

    associatedWith(param) {
      if (this.context === null) {
        return this;
      }
      if (param instanceof Promise) {
        return this;
      }
      if (param instanceof Id) {
        param.model.__ilorm__name
        param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id
        }));

        return this;
      }
      if (param instanceof model.constructor) {
        param.__ilorm__name
        param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id
        }));

        return this;
      }
      throw new Error(`associatedWith does not work with value: ${param}`);
    }

    notAssociatedWith() {

    }

    find() {
      return Promise.all(this.query)
        .then(connector.find);
    }
    findOne() {
      return Promise.all(this.query)
        .then(connector.findOne);
    }
    count() {
      return Promise.all(this.query)
        .then(connector.count);
    }
    remove() {
      return Promise.all(this.query)
        .then(connector.remove);
    }
    removeOne() {
      return Promise.all(this.query)
        .then(connector.removeOne);
    }
    update() {
      return Promise.all([
        this.query,
        this.update
      ])
        .then(([query, update]) => connector.update({query, update}));
    }
    updateOne() {
      return Promise.all([
        this.query,
        this.update
      ])
        .then(([query, update]) => connector.updateOne({query, update}));
    }
    multiple() {}
    stream() {
      return Promise.all(this.query)
        .then(connector.stream);
    }

  }



  return Query;
}

module.exports = injectDependencies;