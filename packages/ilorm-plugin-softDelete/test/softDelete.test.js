/* eslint-disable */

const { expect, } = require('chai');

const Ilorm = require('ilorm').constructor;
const ilorm = new Ilorm();
const ilormSoftDelete = require('../index');


describe('ilorm-plugin-softDelete', () => {
  describe('test/softDelete', () => {

    before(async () => {
      ilorm.use(ilormSoftDelete());
    });

    it('Should add isDeleted field to schema', () => {
      const { Schema, } = ilorm;

      const userSchema = new Schema({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
      });

      expect(userSchema.isDeleted).to.exists;
    })
  });
});




