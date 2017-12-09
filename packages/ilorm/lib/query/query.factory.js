/**
 * Created by guil_ on 09/12/2017.
 */

const Query = require('./query.class');

const queryFactory = ({ model, }) => {
  const connector = model.getConnector();
  const schema = model.getSchema();

  class InternalQuery extends Query {}

  const connectorQueryOptions = {
    ParentQuery: InternalQuery,
  };
  const ConnectorQuery = connector.queryFactory(connectorQueryOptions);

  return ConnectorQuery
};

module.exports = queryFactory;