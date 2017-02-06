/* eslint-disable */
'use strict';

const FieldType = require('../FieldType');
const expect = require('chai').expect;

describe('ilorm-schema - ', () => {

  describe('FieldType', () => {

    it('Should instantiate', () => {
      const schema = new FieldType();

      expect(schema instanceof FieldType).to.be.true;
      expect(schema.required).to.be.a('function');
      expect(schema.default).to.be.a('function');
      expect(schema.isValid).to.be.a('function');
      expect(schema.initValue).to.be.a('function');
      expect(schema.isRequired).to.be.equal(false);
      expect(schema.defaultValue).to.be.equal(undefined);
    });

    it('schema.required should change internal state isRequired', () => {
      const schema = new FieldType();
      expect(schema.isRequired).to.be.equal(false);
      schema.required();
      expect(schema.isRequired).to.be.equal(true);
    });

    it('schema.default should change internal state defaultValue', () => {
      const schema = new FieldType();
      expect(schema.defaultValue).to.be.equal(undefined);
      schema.default('default_value');
      expect(schema.defaultValue).to.be.equal('default_value');
    });

    it('schema.isValid shoud check the validity of a field', () => {
      const schema = new FieldType();

      //If isRequired is false :
      expect(schema.isValid(undefined)).to.be.equal(true);

      //If isRequired is true :
      schema.required();
      expect(schema.isValid(undefined)).to.be.equal(false);
    });

    it('schema.initValue shoud init a valid value a field', () => {

      const schema = new FieldType();

      //defaultValue is undefined
      expect(schema.initValue()).to.be.equal(undefined);

      //Init with a standard var :
      schema.default(3);
      expect(schema.initValue()).to.be.equal(3);

      //Init with a function generator (test Date.now)
      const now = Date.now();
      schema.default(() => (now));
      expect(schema.initValue()).to.be.equal(now);

    });


  });
});