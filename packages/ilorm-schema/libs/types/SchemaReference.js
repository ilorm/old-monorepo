/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaReference extends SchemaType {

  constructor(model) {
    this.referenceModel = model;
  }

  isValid(value) {
    return super.isValid(value);
  }

}

module.exports = SchemaReference;