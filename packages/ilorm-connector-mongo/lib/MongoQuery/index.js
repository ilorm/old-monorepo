/**
 * Created by guillaume on 07/02/2017.
 */

const initQueryProperties = require('./initQueryProperties');

/**
 * Inject dependencies to MongoQuery
 * @param {Query} Query class Query to overload
 * @returns {MongoQuery} The MongoQuery returned by a mongo model
 */
function injectDependencies({ Query, schema, }) {

  /**
   * The MongoQuery overload Query object
   */
  class MongoQuery extends Query {
    /**
     * @param {Object} params Parameters given to the parent Query (see doc at Query)
     * Overload classic query by the mongo version
     */
    constructor(params) {
      super(params);
      initQueryProperties({
        schema,
        query: this,
      });
    }
  }

  return MongoQuery;
}

module.exports = injectDependencies;
