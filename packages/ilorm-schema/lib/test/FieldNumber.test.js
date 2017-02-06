/* eslint-disable */
'use strict';

const FieldNumber = require('../FieldNumber');
const { expect, } = require('chai');

describe('ilorm-schema - ', () => {

  describe('FieldNumber', () => {

    it('Should instantiate', () => {
      const schema = new FieldNumber();

      expect(schema instanceof FieldNumber).to.be.true;
      expect(schema.required).to.be.a('function');
      expect(schema.default).to.be.a('function');
      expect(schema.isValid).to.be.a('function');
      expect(schema.initValue).to.be.a('function');
      expect(schema.isRequired).to.be.equal(false);
      expect(schema.defaultValue).to.be.equal(undefined);
    });

    it('Shoud check validity of a number', () => {
      const schema = new FieldNumber();

      //A string return true :
      expect(schema.isValid(undefined)).to.be.true;
      expect(schema.isValid(33)).to.be.true;

      //not a string, isValid return false :
      expect(schema.isValid('a string')).to.be.false;
      expect(schema.isValid(false)).to.be.false;
      expect(schema.isValid({})).to.be.false;

    });

    it('Should add constraint min and max', () => {
      const schema = new FieldNumber();

      schema.min(3).max(33);
      expect(schema.isValid(undefined)).to.be.true;
      expect(schema.isValid(22)).to.be.true;

      expect(schema.isValid(1)).to.be.false;
      expect(schema.isValid(212)).to.be.false;

      schema.between(1, 10);
      expect(schema.isValid(4)).to.be.true;
      expect(schema.isValid(22)).to.be.false;
      expect(schema.isValid(0)).to.be.false;

      schema.required();
      expect(schema.isValid(undefined)).to.be.false;
    });
  });
});