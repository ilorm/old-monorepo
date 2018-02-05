'use strict';

const prepareAlgoliaSave = require('./prepareAlgoliaSave');
const { ALGOLIA_INDEX, } = require('./fields');

/**
 * Inject Model to create a Model Algolia
 * @param {Model} ParentModel The model to extends
 * @returns {ModelAlgolia} The model algolia
 */
const injectModel = ParentModel => class ModelAlgolia extends ParentModel {
  /**
   * Get the Algolia index associated with the current Model
   * @returns {Object} Return algolia options
   */
  static getAlgoliaIndex() {
    const algoliaOptions = this.getPluginsOptions().algolia;

    if (!algoliaOptions) {
      return null;
    }

    return algoliaOptions.index;
  }

  /**
   * Do the classic save object and moreover save the instance in algolia index
   * @returns {Model} Return current instance model.
   */
  async save() {
    const algoliaIndex = this.constructor.getAlgoliaIndex();

    const saveResult = await super.save();

    if (!algoliaIndex) {
      return saveResult;
    }

    const algoliaObject = prepareAlgoliaSave(this);

    await algoliaIndex.saveObject(algoliaObject);

    return saveResult;
  }

  /**
   * Do the classic remove object and moreover remove the instance from algolia index
   * @returns {Promise.<*>} Return same as classic remove
   */
  async remove() {
    const removeResult = await super.remove();

    const algoliaIndex = this.constructor.getAlgoliaIndex();

    if (!algoliaIndex) {
      return removeResult;
    }

    await algoliaIndex.deleteObject(this._id);

    return removeResult;
  }

  /**
   * Associate current index with the query
   * @returns {Query} The query to use
   */
  static query() {
    const query = super.query();

    query[ALGOLIA_INDEX] = this.getAlgoliaIndex();

    return query;
  }
};

module.exports = injectModel;
