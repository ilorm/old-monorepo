/**
 * Created by guil_ on 27/12/2016.
 */

const modelsMap = {};

module.exports = {
  Model: function model() {
    const model = require('./Model')({name, schema, connector});
    modelsMap[name] = model;
    return model;
  },
  get: function get(name) {
    return modelsMap[name] || null;
  }
};