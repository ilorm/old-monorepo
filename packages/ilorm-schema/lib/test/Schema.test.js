/* eslint-disable */
'use strict';

const Schema = require('../Schema');
const expect = require('chai').expect;

describe('ilorm-schema - ', () => {

  describe('Schema', () => {

    function buildUserSchema() {
      const schema = new Schema({
        firstName: Schema.String().required(),
        lastName: Schema.String(),
        weight: Schema.Number().default(70),
        notASchema: {}
      });

      return schema;
    }

    it('Should instantiate', () => {
      const schema = buildUserSchema();

      expect(schema instanceof Schema).to.be.true;
      expect(schema.keys.length).to.be.equal(3);
    });

    it('Should check validity', () => {
      const schema = buildUserSchema();

      const user = {
        firstName: 'Guillaume'
      };

      const userB = {
        firstName: 'Benjamin',
        weight: 33,
        lastName: 'Test'
      };

      expect(schema.isValid({})).to.be.false;
      expect(schema.isValid(user)).to.be.true;
      expect(schema.isValid(userB)).to.be.true;
    });

    it('Should init with default value', () => {
      const schema = buildUserSchema();

      const user = schema.initValues({});

      expect(user.firstName).to.be.equal(undefined);
      expect(user.lastName).to.be.equal(undefined);
      expect(user.weight).to.be.equal(70);
    });

  });
});