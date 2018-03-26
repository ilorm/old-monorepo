
/**
 * Create a new Mongo Model class.
 * @param {Model} ParentModel The Model used as Parent
 * @returns {KnexModel} The KnexModel created
 */
const mongoModelFactory = ({ ParentModel, }) => (
  class KnexModel extends ParentModel {}
);

module.exports = mongoModelFactory;
