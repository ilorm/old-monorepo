'use strict';

const Class = require('./model.class');
const factory = require('./model.factory');
const map = require('./models.map');

/**
 * Declare a new model
 * @param {String} name Name of the model
 * @param {Model} Model the given class
 * @return {void} Return nothing
 */
const declareModel = (name, Model) => {
  map.set(name, Model);
};

module.exports = {
  Class,
  factory,
  declareModel,
};

