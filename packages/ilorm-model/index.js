/**
 * Created by guil_ on 27/12/2016.
 */

const Id = require('./lib/Id');
const modelFactory = require('./lib/Model');
const modelsMap = {};

module.exports = {
  Id,
  Model: function Model(name, schema, Connector) {
    const param = {
      name,
      modelsMap,
      schema,
      Connector,
    };
    const model = modelFactory(param);

    modelsMap[name] = model;

    return model;
  },
  get: function get(name) {
    return modelsMap[name] || null;
  },
};
