'use strict';

/**
 * Inject boolean class to create a KnexBoolean
 * @param {Boolean} Boolean The class boolean to overload
 * @returns {KnexBoolean} Returns the knex boolean class
 */
const knexBooleanFactory = Boolean => {

  /**
   * Create a KnexBoolean (overload basic boolean with knex init)
   */
  class KnexBoolean extends Boolean {
    /**
     * Method called to init a Knex type table
     * @param {Object} table knex object (use to create table)
     * @returns {void} Return nothing
     */
    initKnexTable(table) {
      table.boolean(this._name);
    }
  }

  return KnexBoolean;
};

module.exports = knexBooleanFactory;
