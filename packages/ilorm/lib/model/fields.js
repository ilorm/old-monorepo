'use strict';

// Use symbol as private attribute of Class Model
const fields = {
  // Boolean to know if the model instance is new (never saved in the database) or not new
  // (already save in the database).
  // Change this value, change the behavior of the save and remove method of the Model.
  IS_NEW: Symbol('isNew'),
};

module.exports = fields;
