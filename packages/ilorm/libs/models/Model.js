/**
 * Created by guil_ on 27/12/2016.
 */

const Id = require('./Id');

function injectDependencies({name, schema, Connector}) {
  const connector = new Connector();

  class Model {
    constructor(obj) {
      this.__ilorm__properties = {};

      Object.defineProperties(this, {
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

      if(!obj) {
        schema.initValue(this);
      }
    }

    save() {
      if(this.__ilorm__isNewObject) {
        this.__ilorm__isNewObject = false;
        return connector.create({
          obj: this
        });
      }

      if(this.__ilorm__editedFields.length === 0) {
        return Promise.resolve(this);
      }

      const result = connector.updateOne({
        obj: this,
        editedFields: this.__ilorm__editedFields
      });
      this.__ilorm__editedFields = [];
      return result;
    }

    remove() {
      if(!this.__ilorm__isNewObject) {
        return connector.removeOne({
          obj: this
        });
      }
    }

    static find(params) {
      return connector.find(params)
        .then(results => (
          results.map(rawObj => new Model(rawObj))
        ));
    }

    static findOne(params) {
      return connector.findOne(params)
        .then(result => new Model(result));
    }

    static id(id) {
      return new Id(this, id);
    }
  }

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

  return Model;
}

module.exports = injectDependencies;