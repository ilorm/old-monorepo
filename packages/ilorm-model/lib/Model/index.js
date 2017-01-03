/**
 * Created by guil_ on 27/12/2016.
 */

const Id = require('./../Id');
const initClassProperties = require('./initClassProperties');
const initInstanceProperties = require('./initInstanceProperties');

function injectDependencies({name, schema, Connector}) {
  const connector = new Connector({ name, schema });

  class Model {
    constructor(obj) {
      initInstanceProperties(this, obj, name, schema);

      if(!obj) {
        schema.initValues(this);
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

    static query() {
      return new this.__ilorm__Query();
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

  initClassProperties({ Model, name, schema, connector });

  return Model;
}

module.exports = injectDependencies;