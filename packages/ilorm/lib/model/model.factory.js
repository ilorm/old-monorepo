/**
 * Created by guil_ on 07/12/2017.
 */

const Model = require('./model.class');

const modelFactory = ({ name, schema, connector, }) => {

  class InternalModel extends Model {
    static getName() {
      return super.getName(name);
    }

    static getSchema() {
      return super.getSchema(schema);
    }

    static getConnector() {
      return super.getConnector(connector);
    }

    static instantiate(rawObject) {
      return super.instantiate(name, rawObject);
    }

    static async getById(id) {
      return super.getById(connector, id);
    }
  };

  const connectorModelParams = {
    name,
    schema,
    ParentModel: InternalModel,
  };
  const ConnectorModel = connector.modelFactory(connectorModelParams);

  return ConnectorModel;
};

module.exports = modelFactory;