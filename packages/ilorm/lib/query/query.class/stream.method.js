'use strict';

const { Readable, Transform, } = require('stream');

const { CONNECTOR, LINKED_WITH, MODEL, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Stream used to restrict query to another query
 */
class LinkedStream extends Readable {
  /**
   * Create a LinkedStream object
   * @param {Query} query The query used as primary target
   * @param {Stream} filterStream Input stream of model which restrict query result
   * @param {Model} currentFilterModel Current model used as restriction of the query
   * @param {Stream} currentStream Stream created from the query (change per each filterStream result).
   */
  constructor({ query, filterStream, currentFilterModel, currentStream, }) {
    super();

    this.filterStream = filterStream;
    this.query = query;
    this.currentFilterModel = currentFilterModel;
    this.currentStream = currentStream;
  }

  /**
   * Method required per Readable interface to create a valid Read stream
   * @returns {Promise} Return nothing really interesting
   * @private
   */
  async _read() {
    const instance = this.currentStream.read();

    if (instance) {
      return this.push(instance);
    }

    this.currentFilterModel = this.filterStream.read();

    if (!this.currentFilterModel) {
      return this.push(null);
    }

    this.currentStream = (await this.query.restrictToModel(this.currentFilterModel))
      .stream();

    return this._read();
  }

  /**
   * Create a LinkedStream object
   * @param {Query} query The query used as primary target
   * @param {Stream} filterStream Input stream of model which restrict query result
   * @returns {LinkedStream} The created linked stream
   */
  static createLinkedStream({ query, filterStream, }) {
    const currentFilterModel = filterStream.read();
    const currentStream = query.restrictToModel(currentFilterModel).stream();

    return new LinkedStream({
      query,
      filterStream,
      currentFilterModel,
      currentStream,
    });
  }
}


class InstantiateStream extends Transform {
  constructor(Model) {
    super();

    this.Model = Model;
  }

  _transform(rawInstance, encoding, callback) {
    callback(null, this.Model.instantiate(rawInstance));
  }
}

/**
 * Create a stream method from the query instance
 * @param {QueryBase} query The query instance to use
 * @returns {Promise.<Stream>} The stream to use.
 */
const streamMethod = async query => {
  await query.prepareQuery();

  if (query[LINKED_WITH]) {
    const readStream = LinkedStream.createLinkedStream({
      query,
      filterStream: await query[LINKED_WITH].stream(),
    });

    return readStream
      .pipe(new InstantiateStream(query[MODEL]));
  }

  const rawStream = await query[CONNECTOR].stream(query);

  return rawStream.pipe(new InstantiateStream(query[MODEL]));
};

module.exports = streamMethod;
