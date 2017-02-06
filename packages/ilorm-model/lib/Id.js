/**
 * Created by guil_ on 27/12/2016.
 */

/**
 * An Id is an unique identifier to a saved data in a database.
 */
class Id {
  /**
   * Create a new Id from a model and an id
   * @param {Model} model The model associated with the Id
   * @param {*} id The Id stored in the Id instance
   */
  constructor(model, id) {
    this.model = model;
    this.id = id;
  }

  /**
   * Load the instance from the Id
   * @returns {*} An instance
   */
  getInstance() {
    return this.model.findOne({ id: this.id, });
  }
}

module.exports = Id;
