/**
 * Created by guil_ on 27/12/2016.
 */

const SchemaType = require('./SchemaType');

class SchemaString extends SchemaType {

  isValid(value) {
    return typeof(value) === 'string' &&
        super.isValid(value);
  }

}

module.exports = SchemaString;