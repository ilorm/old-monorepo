'use strict';

/**
 * Define for the current instance of your model, every required properties
 * @param {Object} instance The instance will be initialized
 * @param {Object} obj An object if the instance have been initialized with values
 * @param {String} name The name of your current model
 * @param {Object} schema The schema associated with your current model
 * @returns {Object} The initialized instance
 */
function initInstanceProperties({ instance, obj, name, schema, }) {

  Object.defineProperties(instance, {
    __ilormProperties: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: {},
    },
    __ilormIsNewObject: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: !obj,
    },
    __ilormEditedFields: {
      enumerable: false,
      writable: true,
      configurable: false,
      value: [],
    },
  });

  schema.keys.forEach(key => {
    Object.defineProperty(instance, key, {
      enumerable: true,
      writable: true,
      configurable: true,
      get: function get() {
        return instance.__ilormProperties[key];
      },
      set: function set(value) {
        if (!schema[key].isValid(value)) {
          throw new Error(`BAD_VALUE: ${value}, model: ${name}, field: ${key}.`);
        }
        instance.__ilormProperties[key] = value;
        instance.__ilormEditedFields.push(key);
      },
    });
  });

  return instance;
}

module.exports = initInstanceProperties;
