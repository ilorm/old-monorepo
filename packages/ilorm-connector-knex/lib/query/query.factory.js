const { KNEX, } = require('./fields');
const { CONNECTOR, } = require('ilorm-constants').QUERY.FIELDS;


/**
 * Inject dependencies to query
 * @param {Query} ParentQuery class Query to overload
 * @returns {KnexQuery} The query returned by a mongo model
 */
const injectDependencies = ({ ParentQuery, }) => {

  /**
   * The query overload Query object
   */
  class KnexQuery extends ParentQuery {
    /**
     * Instantiate a KnexQuery
     * @param {Object} params parameter transmit to parent
     */
    constructor(...params) {
      super(...params);
      this[KNEX] = this[CONNECTOR].getKnex();
    }
  }

  return KnexQuery;
};

module.exports = injectDependencies;
