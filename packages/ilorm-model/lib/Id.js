/**
 * Created by guil_ on 27/12/2016.
 */

class Id {
  constructor(model, id) {
    this.model = model;
    this.id = id;
  }

  getInstance() {
    return this.model.findOne({
      id: this.id
    });
  }
}

module.exports = Id;