'use strict';

// const { QUERY, QUERY_OR, UPDATE, } = require('ilorm').Query.FIELDS;

const { ALGOLIA_INDEX, } = require('./fields');
const ALGOLIA_SEARCH = Symbol('algoliaSearch');

/**
 * Inject Query to create a Query Algolia
 * @param {Query} ParentQuery The model to extends
 * @returns {QueryAlgolia} The model algolia
 */
const injectQuery = ParentQuery => class QueryAlgolia extends ParentQuery {

  /**
   * Search text on algolia
   * @param {String} text The input text to search
   * @returns {QueryAlgolia} Return the query to chainable query
   */
  search(text) {
    if (this[ALGOLIA_INDEX]) {
      throw new Error('Could not use search on a non indexed model');
    }

    this[ALGOLIA_SEARCH] = text;

    return this;
  }

  /**
   * Utility method called before each query, could be used to change query behavior
   * @returns {Promise|void} Return nothing, only change the internal state of query
   */
  async prepareQuery() {
    await super.prepareQuery();

    if (!this[ALGOLIA_INDEX] || !this[ALGOLIA_SEARCH]) {
      return;
    }

    const currentIndex = this[ALGOLIA_INDEX];
    const query = this[ALGOLIA_SEARCH];

    const algoliaResult = await currentIndex.search({
      query,
    });

    const { hits, } = algoliaResult;

    const objectIDList = hits.map(hit => hit.objectID);

    this._id.isIn(objectIDList);
  }
};

module.exports = injectQuery;
