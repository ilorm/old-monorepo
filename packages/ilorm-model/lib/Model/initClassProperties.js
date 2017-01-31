/**
 * Created by guillaume on 01/01/2017.
 */
const queryInjector = require('ilorm-query');
const Id = require('../Id');

function initProperties({ Model, modelsMap, schema, name, connector }) {
  Object.defineProperties(Model.prototype, {
    __ilorm__name: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: name
    },
    __ilorm__schema: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: schema
    },
    __ilorm__connector: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: connector
    },
    __ilorm__Query: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: queryInjector({ Model, Id, schema, modelsMap, connector})
    }
  });

}

module.exports = initProperties;