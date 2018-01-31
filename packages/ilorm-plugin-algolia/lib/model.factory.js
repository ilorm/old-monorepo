'use strict';

const prepareAlgoliaSave = require('./prepareAlgoliaSave');

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
    const algoliaOptions = this.constructor.getPluginsOptions().algolia;

    if (algoliaOptions) {
      return null;
    }

    return algoliaOptions.index;
  }

  /**
   * Do the classic save object and moreover save the instance in algolia index
   * @returns {Model} Return current instance model.
   */
  async save() {
    const algoliaIndex = ModelAlgolia.getAlgoliaIndex();

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

    const algoliaIndex = ModelAlgolia.getAlgoliaIndex();

    if (!algoliaIndex) {
      return removeResult;
    }

    await algoliaIndex.deleteObject(this._id);

    return removeResult;
  }
};

module.exports = injectModel;
