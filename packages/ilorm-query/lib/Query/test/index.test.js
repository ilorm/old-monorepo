'use strict';

const Schema = require('ilorm-schema').Schema;
const queryInjector = require('../index');
const expect = require('chai').expect;

function buildUserSchema() {
  return new Schema({
    firstName: Schema.String(),
    lastName: Schema.String(),
    weight: Schema.Number()
  });
}

function buildQuery(connector) {
  return queryInjector({
    connector,
    model: {},
    schema: buildUserSchema(),
  });
}

describe('ilorm-query - ', () => {
  describe('Query', () => {

    it('Should build simple query to find', (done) => {
      const Query = buildQuery({
        find: (query) => {
          expect(query.length).to.be.equal(3);
          expect(query[0]).to.deep.equal({
            operator: 'EQUAL',
            context: 'firstName',
            value: 'Guillaume'
          });

          expect(query[1]).to.deep.equal({
            operator: 'NOT_EQUAL',
            context: 'lastName',
            value: 'Daix'
          });

          expect(query[2]).to.deep.equal({
            operator: 'BETWEEN',
            context: 'weight',
            value: {
              min: 50,
              max: 100
            }
          });
          done();
        }
      });

      const currentQuery = new Query();

      currentQuery
        .firstName.is('Guillaume')
        .lastName.isNot('Daix')
        .weight.between(50, 100)
        .find();

    });
  });
});