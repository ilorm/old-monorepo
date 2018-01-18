/**
 * Inject dependencies to query
 * @param {Query} ParentQuery class Query to overload
 * @returns {MongoQuery} The query returned by a mongo model
 */
const injectDependencies = ({ ParentQuery, }) => {

  /**
   * The query overload Query object
   */
  class MongoQuery extends ParentQuery {}

  return MongoQuery;
};

module.exports = injectDependencies;
