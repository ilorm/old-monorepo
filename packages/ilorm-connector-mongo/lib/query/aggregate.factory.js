'use strict';

const definition = Symbol('definition');
const pipeline = Symbol('pipeline');

/**
 * Create an aggregate query class by injecting the linked Model
 * @param {Model} Model class Model linked with the resulting aggregate query
 * @return {AggregateQuery} The aggregate query linked with the given model
 */
const aggregateFactory = Model => {

  /**
   * Class representing an aggregate query
   */
  class AggregateQuery {
    /**
     * Init the aggregate query class
     */
    constructor() {
      this[pipeline] = [];
      this[definition] = {};
    }

    /**
     * Match level aggregation
     * @param {Function} handler the handler to apply match query
     * @returns {AggregateQuery} Return current query to make other aggregate operation
     */
    match(handler) {
      const match = {};
      const pipelineStage = {};

      handler({ match, });

      this[pipeline].push(pipelineStage);

      return this;
    }

    /**
     * Skip over the specified number of document that pass into the stage
     * @param {Number} number Number of document to skip
     * @returns {AggregateQuery} The aggregate query to chain stage
     */
    skip(number) {
      this[pipeline].push({
        $skip: number,
      });

      return this;
    }

    /**
     * Limits the number of documents passed to the next stage in the pipeline.
     * @param {Number} number Number of document to limit
     * @returns {AggregateQuery} The aggregate query to chain stage
     */
    limit(number) {
      this[pipeline].push({
        $limit: number,
      });

      return this;
    }

    /**
     * Group level aggregation
     */
    group(handler) {
      const previous = {};
      const next = {};
      const pipelineStage = {};

      handler({ previous, next, });

      this[pipeline].push(pipelineStage);

      return this;
    }

    unwind(handler) {

      return this;
    }

    sort(handler) {

      return this;
    }

    /**
     * Execute the aggregate and return the results
     * @returns {Array} The aggregate result
     */
    exec() {
      return Model.getConnector()
        .aggregate(this[pipeline]);
    }

    /**
     * Execute the aggregate and return the first result
     * @returns {Object} The aggregate result
     */
    async execAndReturnOne() {
      const results = await this.exec();

      return results[0];
    }
  }

  return AggregateQuery;
};

module.exports = aggregateFactory;
