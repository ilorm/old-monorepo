/**
 * Created by guil_ on 13/12/2017.
 */

const { OPERATIONS, FIELDS, } = require('ilorm-constants').QUERY;
const { NOT_IS, SET, } = OPERATIONS;
const { UPDATE, } = FIELDS;

/**
 * Create a SoftDeleteQuery class
 * @param {String} deletedField field used to handle softDelete
 * @param {Query} Query The schema to extends
 * @returns {SoftDeleteQuery} The new Query
 */
const injectQuery = ({ deletedField, }) => Query => class SoftDeleteQuery extends Query {
  /**
   * Apply a isDeleted not equal true query, if the parameter is missing.
   *
   * isDeleted NOT_EQUAL true because :
   * If true => deleted
   * If false => not deleted
   * If missing => not deleted (maybe old item, create before the plugin and the support of soft delete query)
   *
   * @param {Object} query The query to change
   * @returns {Object} The new query
   */
  prepareQuery(query) {
    if (!query[deletedField]) {
      query[deletedField] = {
        [NOT_IS]: true,
      };
    }

    return query;
  }

  /**
   * Remove one or more entries which match the query
   * Make a force remove always destroy the entry in the database
   * use remove for soft delete
   * @returns {*} TODO
   */
  forceRemove() {
    return super.remove();
  }

  /**
   * Remove one entry which match the query
   * Make a force remove always destroy the entry in the database
   * use remove for soft delete
   * @returns {*} TODO
   */
  forceRemoveOne() {
    return super.removeOne();
  }

  /**
   * Remove (soft) one or more entries which match the query
   * Make a soft remove only update the isDeleted flag to true, to "hide" the document to other query
   * use forceRemove to real delete of the document from the database
   * @returns {*} TODO
   */
  remove() {
    this[UPDATE][deletedField][SET] = true;

    return super.update();
  }

  /**
   * Remove (soft) one entry which match the query
   * Make a soft remove only update the isDeleted flag to true, to "hide" the document to other query
   * use forceRemove to real delete of the document from the database
   * @returns {*} TODO
   */
  removeOne() {
    this[UPDATE][deletedField][SET] = true;

    return super.updateOne();
  }
};

module.exports = injectQuery;
