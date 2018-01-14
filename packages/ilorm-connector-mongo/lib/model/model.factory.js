/**
 * Created by guil_ on 07/12/2017.
 */

/**
 * Create a new Mongo Model class.
 * @param {Model} ParentModel The Model used as Parent
 * @returns {MongoModel} The MongoModel created
 */
const mongoModelFactory = ({ ParentModel, }) => (
  class MongoModel extends ParentModel {
  }
);

module.exports = mongoModelFactory;
