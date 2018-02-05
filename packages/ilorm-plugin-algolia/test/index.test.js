'use strict';

const { expect, } = require('chai');
const sinon = require('sinon');

const initScenario = require('./initScenario');

describe('ilorm-plugin-algolia', () => {
  let params;

  const mockAlgoliaIndex = {
    saveObject: sinon.spy(),
    deleteObject: sinon.spy(),
    search: sinon.stub(),
  };

  before(async () => {
    params = await initScenario(mockAlgoliaIndex);
  });

  after(() => params.endScenario());

  it('Should save instance in algolia', async () => {
    const { User, } = params;

    const userTest = new User({
      firstName: 'Smith',
      lastName: 'Martin',
    });

    await userTest.save();

    sinon.assert.calledOnce(mockAlgoliaIndex.saveObject);
  });

  it('Should query in function of algolia results', async () => {
    const { User, } = params;

    const userTest = await User.query()
      .firstName.is('Smith')
      .findOne();

    mockAlgoliaIndex.search.returns({
      hits: [
        {
          ObjectID: userTest._id,
        },
      ],
    });

    const user = await User.query()
      .search('Smi')
      .findOne();

    sinon.assert.calledOnce(mockAlgoliaIndex.search);
    expect(user.firstName).to.be.equal('Smith');

  });

  it('Should remove instance from algolia', async () => {
    const { User, } = params;

    const userTest = await User.query()
      .firstName.is('Smith')
      .findOne();

    await userTest.remove();

    sinon.assert.calledOnce(mockAlgoliaIndex.deleteObject);
  });

});
