/**
 * Created by guil_ on 27/12/2016.
 */

class Id {
  constructor(model, id) {
    this.model = model;
    this.id = id;
  }

  getInstance() {
    return model.findOne({id});
  }
}

module.exports = Id;