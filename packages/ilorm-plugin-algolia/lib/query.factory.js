'use strict';

/**
 * Inject Query to create a Query Algolia
 * @param {Query} ParentQuery The model to extends
 * @returns {QueryAlgolia} The model algolia
 */
const injectQuery = ParentQuery => class QueryAlgolia extends ParentQuery {

};

module.exports = injectQuery;
