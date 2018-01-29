'use strict';

/**
 * Inject Model to create a Model Algolia
 * @param {Model} ParentModel The model to extends
 * @returns {ModelAlgolia} The model algolia
 */
const injectModel = ParentModel => class ModelAlgolia extends ParentModel {

};

module.exports = injectModel;
