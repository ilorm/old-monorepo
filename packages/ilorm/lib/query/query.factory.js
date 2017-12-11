/**
 * Created by guil_ on 09/12/2017.
 */

const Query = require('./query.class');
const FIELDS = require('./fields');

const defineProperty = variable => ({ value: variable, });

const queryFactory = ({ model, }) => {
  const connector = model.getConnector();
  const schema = model.getSchema();

class InternalQuery extends Query {}

Object.defineProperties(InternalQuery.prototype, {
  [FIELDS.SCHEMA]: defineProperty(schema),
  [FIELDS.CONNECTOR]: defineProperty(connector),
  [FIELDS.QUERY]: defineProperty({}),
});

const connectorQueryOptions = {
  ParentQuery: InternalQuery,
};
const ConnectorQuery = connector.queryFactory(connectorQueryOptions);

return ConnectorQuery
};

module.exports = queryFactory;
