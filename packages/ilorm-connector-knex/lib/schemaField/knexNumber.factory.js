'use strict';

/**
 * Inject number class to create a KnexNumber
 * @param {Number} Number The class number to overload
 * @returns {KnexNumber} Returns the knex number class
 */
const knexNumberFactory = Number => {

  /**
   * Create a KnexNumber (overload basic number with knex init)
   */
  class KnexNumber extends Number {
    /**
     * Method called to init a Knex type table
     * @param {Object} table knex object (use to create table)
     * @returns {void} Return nothing
     */
    initKnexTable(table) {
      table.integer(this._name);
    }
  }

  return KnexNumber;
};

module.exports = knexNumberFactory;
