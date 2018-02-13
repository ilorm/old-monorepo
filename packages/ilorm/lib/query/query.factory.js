/**
 * Created by guil_ on 09/12/2017.
 */

const { getQuery, } = require('./query.class');
const { SCHEMA, MODEL, CONNECTOR, QUERY, UPDATE, SORT, SELECT, } = require('ilorm-constants').QUERY.FIELDS;

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
  class InternalQuery extends getQuery() {}

  Object.defineProperties(InternalQuery.prototype, {
    [SCHEMA]: defineProperty(schema),
    [CONNECTOR]: defineProperty(connector),
    [QUERY]: defineProperty({}),
    [UPDATE]: defineProperty({}),
    [SORT]: defineProperty({}),
    [SELECT]: defineProperty({}),
    [MODEL]: defineProperty(model),
  });

  const connectorQueryOptions = {
    schema,
    ParentQuery: InternalQuery,
  };
  const ConnectorQuery = connector.queryFactory(connectorQueryOptions);


  return ConnectorQuery;
};

module.exports = queryFactory;
