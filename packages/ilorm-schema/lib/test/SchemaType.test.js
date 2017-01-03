'use strict';

const SchemaType = require('../SchemaType');
const expect = require('chai').expect;

describe('ilorm-schema - ', () => {

  describe('SchemaType', () => {

    it('Should instantiate', () => {
      const schema = new SchemaType();

      expect(schema instanceof SchemaType).to.be.true;
      expect(schema.required).to.be.a('function');
      expect(schema.default).to.be.a('function');
      expect(schema.isValid).to.be.a('function');
      expect(schema.initValue).to.be.a('function');
      expect(schema.isRequired).to.be.equal(false);
      expect(schema.defaultValue).to.be.equal(undefined);
    });

    it('schema.required should change internal state isRequired', () => {
      const schema = new SchemaType();
      expect(schema.isRequired).to.be.equal(false);
      schema.required();
      expect(schema.isRequired).to.be.equal(true);
    });

    it('schema.default should change internal state defaultValue', () => {
      const schema = new SchemaType();
      expect(schema.defaultValue).to.be.equal(undefined);
      schema.default('default_value');
      expect(schema.defaultValue).to.be.equal('default_value');
    });

    it('schema.isValid shoud check the validity of a field', () => {
      const schema = new SchemaType();

      //If isRequired is false :
      expect(schema.isValid(undefined)).to.be.equal(true);

      //If  isRequired is true :
      schema.required();
      expect(schema.isValid(undefined)).to.be.equal(true);
    });

    it('schema.initValue shoud init a valid value a field', () => {

      const schema = new SchemaType();

      //defaultValue is undefined
      expect(schema.initValue()).to.be.equal(undefined);

    });


  });
});