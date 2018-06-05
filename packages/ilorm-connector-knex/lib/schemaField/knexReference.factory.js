'use strict';

/**
 * Inject Reference class to create a KnexReference
 * @param {Reference} Reference The class Reference to overload
 * @returns {KnexReference} Returns the knex Reference class
 */
const knexReferenceFactory = Reference => {

  /**
   * Create a KnexReference (overload basic Reference with knex init)
   */
  class KnexReference extends Reference {
    /**
     * Method called to init a Knex type table
     * @param {Object} table knex object (use to create table)
     * @returns {void} Return nothing
     */
    initKnexTable(table) {
      table.references(this._name);
    }
  }

  return KnexReference;
};

module.exports = knexReferenceFactory;
