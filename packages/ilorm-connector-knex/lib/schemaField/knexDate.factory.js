'use strict';

/**
 * Inject Date class to create a KnexDate
 * @param {Date} Date The class Date to overload
 * @returns {KnexDate} Returns the knex Date class
 */
const knexDateFactory = Date => {

  /**
   * Create a KnexDate (overload basic Date with knex init)
   */
  class KnexDate extends Date {
    /**
     * Method called to init a Knex type table
     * @param {Object} table knex object (use to create table)
     * @returns {void} Return nothing
     */
    initKnexTable(table) {
      table.dateTime(this._name);
    }
  }

  return KnexDate;
};

module.exports = knexDateFactory;
