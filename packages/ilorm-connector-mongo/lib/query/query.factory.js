/**
 * Inject dependencies to query
 * @param {Query} Query class Query to overload
 * @returns {MongoQuery} The query returned by a mongo model
 */
const injectDependencies = ({ Query, }) => {

  /**
   * The query overload Query object
   */
  class MongoQuery extends Query {}

  return MongoQuery;
};

module.exports = injectDependencies;
