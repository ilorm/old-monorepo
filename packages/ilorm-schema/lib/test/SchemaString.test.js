'use strict';

const SchemaString = require('../SchemaString');
const expect = require('chai').expect;

describe('ilorm-schema - ', () => {

  describe('SchemaString', () => {

    it('Should instantiate', () => {
      const schema = new SchemaString();

      expect(schema instanceof SchemaString).to.be.true;
      expect(schema.required).to.be.a('function');
      expect(schema.default).to.be.a('function');
      expect(schema.isValid).to.be.a('function');
      expect(schema.initValue).to.be.a('function');
      expect(schema.isRequired).to.be.equal(false);
      expect(schema.defaultValue).to.be.equal(undefined);
    });

    it('Shoud check validity of a string', () => {

      const schema = new SchemaString();
      //A string return true :
      expect(schema.isValid(undefined)).to.be.true;
      expect(schema.isValid('a string')).to.be.true;

      //not a string, isValid return false :
      expect(schema.isValid(33)).to.be.false;
      expect(schema.isValid(false)).to.be.false;
      expect(schema.isValid({})).to.be.false;

    });
  });
});