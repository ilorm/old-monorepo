'use strict';

const Class = require('./model.class');
const factory = require('./model.factory');
const map = require('./models.map');

/**
 * Declare a new model
 * The declaration system is used to handle reference system.
 * @param {BaseModel} Model the given class
 * @return {void} Return nothing
 */
const declareModel = Model => {
  // Use declaration name as key of the hashmap.
  // A model name need to be unique in a project.
  map.set(Model.getName(), Model);
};

module.exports = {
  Class,
  factory,
  declareModel,
};

