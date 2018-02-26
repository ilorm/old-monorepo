/**
 * Inject dependencies to query
 * @param {Query} ParentQuery class Query to overload
 * @returns {MongoQuery} The query returned by a mongo model
 */
const injectDependencies = ({ ParentQuery, }) => {

  /**
   * The query overload Query object
   */
  class MongoQuery extends ParentQuery {
    /**
     * Apply the primary key of the current query
     * @param {ObjectId} primary The key to apply
     * @returns {Void} Return nothing
     */
    restrictToPrimary(primary) {
      if (Array.isArray(primary)) {
        this._id.isIn(primary);

        return null;
      }

      this._id.is(primary);

      return null;
    }
  }

  return MongoQuery;
};

module.exports = injectDependencies;
