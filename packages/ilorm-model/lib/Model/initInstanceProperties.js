'use strict';

function initInstanceProperties(instance, obj, name, schema) {

  Object.defineProperties(instance, {
    __ilorm__properties: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {}
    },
    __ilorm__isNewObject: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: !obj
    },
    __ilorm__editedFields: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: []
    }
  });

  schema.keys.forEach(key => {
    Object.defineProperty(instance, key, {
      enumerable: true,
      writable: true,
      configurable: true,
      get: function get() {
        return instance.__ilorm__properties[key];
      },
      set: function set(value) {
        if(!schema[key].isValid(value)) {
          throw new Error('BAD_VALUE:' + value + ',model:' + name + ',field:' + key);
        }
        instance.__ilorm__properties[key] = value;
        instance.__ilorm__editedFields.push(key);
      }
    });
  });
}

module.exports = initInstanceProperties;