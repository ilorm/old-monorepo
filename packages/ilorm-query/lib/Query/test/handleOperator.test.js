'use strict';

const handleOperator = require('../handleOperator');
const expect = require('chai').expect;

describe('ilorm-query - ', () => {
  describe('handleOperator', () => {

    it('Shoud add operator to the query', (done) => {
      const value = handleOperator({context: 'firstName', query: []}, 'EQUAL', 'Guillaume');

      expect(value.query).to.exists;
      expect(value.context).to.exists;
      expect(value.query[0] instanceof Promise).to.be.true;

      value.query[0]
        .then(value => {
          expect(value.context).to.be.equal('firstName');
          expect(value.operator).to.be.equal('EQUAL');
          expect(value.value).to.be.equal('Guillaume');
          done();
        })
        .catch(done);


    });

    it('Shoud throw exception if not context provided', () => {
      const fn = handleOperator.bind({}, {context: null, query: []}, 'EQUAL', 3);

      expect(fn).to.throw(Error);
    });
  });
});