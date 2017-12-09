/**
 * Created by guil_ on 07/12/2017.
 */


const mongoModelFactory = ({ ParentModel, }) => {
  return class MongoModel extends ParentModel {

  }
};

module.exports = mongoModelFactory;
