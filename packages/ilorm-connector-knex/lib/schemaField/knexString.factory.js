'use strict';

/**
 * Inject string class to create a KnexString
 * @param {String} String The class string to overload
 * @returns {KnexString} Returns the knex string class
 */
const knexStringFactory = String => {

  /**
   * Create a KnexString (overload basic string with knex init)
   */
  class KnexString extends String {
    /**
     * Method called to init a Knex type table
     * @param {Object} table knex object (use to create table)
     * @returns {void} Return nothing
     */
    initKnexTable(table) {
      table.string(this._name);
    }
  }

  return KnexString;
};

module.exports = knexStringFactory;
