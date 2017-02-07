/**
 * Created by guil_ on 30/12/2016.
 */

const initQueryProperties = require('./initQueryProperties');

/**
 * Inject dependencies in Query class
 * @param {Object} model The model used by the Query
 * @param {Object} schema The schema used by the Query
 * @param {Object} Id The Id Object used by the Query
 * @param {Object} connector The DbConnector
 * @returns {Query} Query Class
 */
function injectDependencies({ model, schema, Id, connector, }) {

  /**
   * Represent a Query at the database
   */
  class Query {
    /**
     * Instantiate a new query object
     * @param {Query} modelQuery Could build a query from another query
     */
    constructor({ modelQuery, }) {
      this.query = modelQuery && modelQuery.query ? modelQuery.query : [];
      this.updateQuery = modelQuery && modelQuery.updateQuery ? modelQuery.updateQuery : [];
      this.context = null;
      initQueryProperties({
        schema,
        query: this,
      });
    }

    /**
     * Set the target of the next operation defined on the query
     * @param {String|String[]} fields The field targeted by the next operation.
     * @returns {Query} Return the query object for chained definition.
     */
    fields(fields) {
      this.context = fields;

      return this;
    }

    /**
     * TODO: Improve the doc
     * TODO: Need an implementation
     * Make a query of association between the field and the parameter given.
     * @param {Id|Model|Query} param The parameter given for make the association.
     * @returns {Query} Return the query object for chained definition.
     */
    associatedWith(param) {
      if (this.context === null) {
        return this;
      }
      if (param instanceof Promise) {
        return this;
      }
      if (param instanceof Id) {
        // param.model.__ilormName
        // param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id,
        }));

        return this;
      }
      if (param instanceof model.constructor) {
        // param.__ilormName
        // param.id
        this.query.push(Promise.resolve({
          context: this.context,
          operator: 'EQUAL',
          value: param.id,
        }));

        return this;
      }
      throw new Error(`associatedWith does not work with value: ${param}`);
    }

    /**
     * Do nothing...
     * TODO: Need an implementation
     * @returns {Undefined} undefined stuff
     */
    notAssociatedWith() {

    }

    /**
     * Run the query to find instance
     * @returns {Promise.<Model[]>} Associated instance
     */
    find() {
      return Promise.all(this.query)
        .then(connector.find);
    }

    /**
     * Run the query to find one instance
     * @returns {Promise.<Model>} The instance found
     */
    findOne() {
      return Promise.all(this.query)
        .then(connector.findOne);
    }

    /**
     * Run the query to count instance
     * @returns {Promise.<Number>} The number of instance found
     */
    count() {
      return Promise.all(this.query)
        .then(connector.count);
    }

    /**
     * Run the query to remove element from the database
     * @returns {Promise.<Number>} The number of element removed
     */
    remove() {
      return Promise.all(this.query)
        .then(connector.remove);
    }

    /**
     * Run the query to remove one element from the database
     * @returns {Promise.<Boolean>} Return true if one element was removed, false if not
     */
    removeOne() {
      return Promise.all(this.query)
        .then(connector.removeOne);
    }

    /**
     * Run an update query. Return the number of element updated from the database.
     * @returns {Promise.<Number>} The number of element updated
     */
    update() {
      return Promise.all([
        this.query,
        this.updateQuery,
      ])
        .then(([ query, update, ]) => connector.update({
          query,
          update,
        }));
    }

    /**
     * Run an update query, to edit one document. Return true if one element was updated from the database.
     * @returns {Promise.<TResult>} Return true if one element was updated, false if not.
     */
    updateOne() {
      return Promise.all([
        this.query,
        this.updateQuery,
      ])
        .then(([ query, update, ]) => connector.updateOne({
          query,
          update,
        }));
    }

    /**
     * TODO: Improve doc
     * TODO: Need an implementation
     * Run a multiple query
     * @returns {undefined} an undefined value
     */
    multiple() {}

    /**
     * Run the query to generate a stream
     * @returns {Promise.<Stream>} The created stream
     */
    stream() {
      return Promise.all(this.query)
        .then(connector.stream);
    }

  }



  return Query;
}

module.exports = injectDependencies;
