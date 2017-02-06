/**
 * Created by guil_ on 27/12/2016.
 */

const FieldType = require('./FieldType');

/**
 * Reference another data
 */
class FieldReference extends FieldType {

  /**
   * Set the model referenced by the field
   * @param {Model} model The model referenced by the field
   */
  constructor(model) {
    super();
    this.referenceModel = model;
  }

}

module.exports = FieldReference;
