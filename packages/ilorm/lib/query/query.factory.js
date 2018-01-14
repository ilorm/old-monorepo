/**
 * Created by guil_ on 09/12/2017.
 */

const Query = require('./query.class');
const FIELDS = require('./fields');

/**
 * Create a property option object (Object.defineProperty)
 * With a value field only ;
 * configurable: false,
 * writable: false,
 * enumerable : false,
 * @param {Mixed} variable The variable to associate with the value
 * @returns {Object} The param object
 */
const defineProperty = variable => ({ value: variable, });

/**
 * Create a new Query class from the given context
 * @param {Model} model The model associated with the Query
 * @returns {Query} A new Query Class
 */
const queryFactory = ({ model, }) => {
  const connector = model.getConnector();
  const schema = model.getSchema();

  /**
   * The InternalQuery is a class created dynamically in function of the model.
   */
  class InternalQuery extends Query {}

  Object.defineProperties(InternalQuery.prototype, {
    [FIELDS.SCHEMA]: defineProperty(schema),
    [FIELDS.CONNECTOR]: defineProperty(connector),
    [FIELDS.QUERY]: defineProperty({}),
    [FIELDS.MODEL]: defineProperty(model),
  });

  const connectorQueryOptions = {
    schema,
    Query: InternalQuery,
  };
  const ConnectorQuery = connector.queryFactory(connectorQueryOptions);


  return ConnectorQuery;
};

module.exports = queryFactory;
