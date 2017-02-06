/* eslint-disable */
'use strict';

const expect = require('chai').expect;
const lib = require('./index');

describe('ilorm-model', () => {
  it('Should init with the good value', () => {
    expect(lib).to.be.a('object');
    expect(lib.Id).to.be.a('function');
    expect(lib.Model).to.be.a('function');
    expect(lib.get).to.be.a('function');
  });

  it('Should store and load Model', () => {
    class fakeConnector {}
    const fakeSchema = {
      keys: [],
      initValues: () => {}
    };

    const Model = lib.Model('test', fakeSchema, fakeConnector);
    expect(Model).to.be.a('function');
    expect(new Model()).to.be.an('object');

    const AnotherModel = lib.get('test');
    expect(new AnotherModel() instanceof Model).to.be.true;

    //Not a model :
    expect(lib.get('not_model')).to.be.equal(null);
  });
});