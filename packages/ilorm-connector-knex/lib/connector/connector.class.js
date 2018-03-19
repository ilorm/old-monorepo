'use strict';

/**
 * Generate a KnexConnector by injecting the knex instance
 * @param {Object} knex knex object
 * @return {KnexConnector} The resulting Connector
 */
const injectDb = ({ knex, }) => {

  /**
   * Class representing a ilorm connector binded with knex
   */
  class KnexConnector {
    /**
     * Bind current connector with the given table
     * @param {String} tableName The table name
     */
    constructor({ tableName, }) {
      this.tableName = tableName;
    }
  }

  return KnexConnector;
};

module.exports = injectDb;
