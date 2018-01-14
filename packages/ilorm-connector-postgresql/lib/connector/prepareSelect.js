'use strict';

/**
 * Prepare SELECT part of a SQL Query
 * @param {String} table The target table
 * @param {String} [fields=*] The target fields
 * @returns {string} Return the query SELECT
 */
const prepareSelect = (table, fields = '*') => `SELECT ${fields} FROM ${table}`;

module.exports = prepareSelect;
