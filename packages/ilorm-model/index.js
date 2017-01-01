/**
 * Created by guil_ on 27/12/2016.
 */

const modelsMap = {};

module.exports = {
  Id: require('./libs/Id'),
  Model: function model(name, schema, Connector) {
    const model = require('./libs/Model')({name, schema, Connector});
    modelsMap[name] = model;
    return model;
  },
  get: function get(name) {
    return modelsMap[name] || null;
  }
};