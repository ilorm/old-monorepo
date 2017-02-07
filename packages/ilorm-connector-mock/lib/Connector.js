/**
 * Created by guillaume on 07/02/2017.
 */

const StreamReadable = require('stream').Readable;

/**
 * Inject dependencies into the mock Connector
 * @returns {MockConnector} return a MockConnector class
 */
function mockFactory() {

  /**
   * The MockConnector class
   * The MockConnector could be used to make easier test, or to make R&D on ilorm
   */
  class MockConnector {
    /**
     * Fake create
     * @param {Object} docs fake docs
     * @return {Promise.<Object>} docs
     */
    create(docs) {
      return Promise.resolve(docs);
    }

    /**
     * Fake find
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    find(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake findOne
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    findOne(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake count
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    count(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake update
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    update(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake updateOne
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    updateOne(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake remove
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    remove(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake removeOne
     * @param {Object} params fake params
     * @return {Promise.<Object>} params
     */
    removeOne(params) {
      return Promise.resolve(params);
    }

    /**
     * Fake stream
     * @param {Object} params fake params
     * @return {Stream} The stream will emit only one data : the params
     */
    stream(params) {
      const stream = new StreamReadable();

      stream.push(params);

      return stream;
    }
  }

  return MockConnector;
}

module.exports = mockFactory;
