/**
 * Created by guillaume on 01/01/2017.
 */

function initProperties({ Model, schema, name, connector }) {
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
    }
  });

  schema.keys.forEach(key => {
    Object.defineProperty(Model.prototype, key, {
      enumerable: true,
      writable: true,
      configurable: true,
      get: function get() {
        return this.__ilorm__properties[key];
      },
      set: function set(value) {
        if(!schema[key].isValid(value)) {
          throw new Error('BAD_VALUE:' + value + ',model:' + name + ',field:' + key);
        }
        this.__ilorm__properties[key] = value;
        this.__ilorm__editedFields.push(key);
      }
    });
  });
}

module.exports = initProperties;