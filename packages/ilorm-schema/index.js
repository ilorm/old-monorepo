/**
 * Created by guil_ on 27/12/2016.
 */

const schema = {
  //Global schema file :
  Schema: require('./lib/Schema'),

  //Parent class Type :
  Type: require('./lib/SchemaType'),

  //Types :
  Number: require('./lib/SchemaNumber'),
  String: require('./lib/SchemaString'),

};

module.exports = schema;