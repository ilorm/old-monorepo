/* eslint-disable */

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { spy, stub } = require('sinon');


chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../baseModel.classFactory');
const { IS_NEW, } = require('../fields');

const fakeIlorm = {
  modelsIndex: new Map(),
};

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      it('If instantiate a model from the raw constructor, need to be flagged as IS_NEW=true', () => {
        const BaseModel = baseModelClassFactory(fakeIlorm);

        const instance = new BaseModel();

        expect(instance[IS_NEW]).to.be.equal(true);
      });

      it('Methods relative to top level Model should throw an error (Connector, schema, name, plugins...)', () => {
        const BaseModel = baseModelClassFactory(fakeIlorm);
        const modelInstance = new BaseModel();

        expect(BaseModel.getConnector).to.throw('Missing connector binding with the Model');
        expect(BaseModel.getSchema).to.throw('Missing Schema binding with the Model');
        expect(BaseModel.getName).to.throw('Missing Name binding with the Model');
        expect(BaseModel.getPluginsOptions).to.throw('Missing plugins options binding with the Model');
        expect(modelInstance.getQueryPrimary).to.throw('Missing overload by the connector model');
        expect(modelInstance.getPrimary).to.throw('Missing overload by the connector model');
      });

      it('Methods using linked methods relative to top Model should throw an error (Connector, schema, name...)', () => {
        const BaseModel = baseModelClassFactory(fakeIlorm);
        const modelInstance = new BaseModel();


        expect(BaseModel.getById()).to.be.rejectedWith('Missing connector binding with the Model');

        expect(modelInstance.getJson.bind(modelInstance)).to.throw('Missing Schema binding with the Model');
        expect(modelInstance.save()).to.be.rejectedWith('Missing connector binding with the Model');
      });

      it('save should create the object if the instance is new', () => {

      });

      it('save should update the object if the instance is not new and a field is updated', async () => {
        const BaseModel = baseModelClassFactory(fakeIlorm);

        const updateOne = spy();

        // Create a fake model with a connector binded:
        class FakeModel extends BaseModel {
          static getConnector() {
            return {
              updateOne
            };
          }

          getQueryPrimary() {
            return 'FAKE_PRIMARY';
          }
        }

        const instance = new FakeModel();
        instance[IS_NEW] = false; // Convert the instance to an not new instance
        instance.property = 'new value';

        await instance.save();

        assert(updateOne.calledWith('FAKE_PRIMARY', {
          property: 'new value',
        }))
      });

      it('getJson should call initInstance with the schema binded with the model', () => {
        const BaseModel = baseModelClassFactory(fakeIlorm);

        const initInstance = stub()
          .returns({
            fakeAttribute: 'fakeValue',
          });

        // Create a fakeModel with a fake schema binded:
        class FakeModel extends BaseModel {
          static getSchema() {
            return {
              initInstance,
            }
          }
        }

        const instance = new FakeModel();

        expect(instance.getJson()).to.be.deep.equal({
          fakeAttribute: 'fakeValue',
        });

        assert(initInstance.calledWith(instance));
      });
    });
  });
});
