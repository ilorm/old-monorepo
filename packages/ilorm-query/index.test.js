'use strict';

const expect = require('chai').expect;
const lib = require('./index');

describe('ilorm-query', () => {
  it('Should contain the Query Class', () => {
    expect(lib).to.be.a('function');
  });
});