/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaString extends SchemaType {

  isValid(value) {
    return (!this.isRequired && value === undefined) || typeof(value) === 'string';
  }

}

module.exports = SchemaString;