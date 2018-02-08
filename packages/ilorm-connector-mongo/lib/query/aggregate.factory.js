'use strict';

const definition = Symbol('definition');
const previous = Symbol('previous');

const aggregateFactory = Model => {

  class AggregateQuery {
    constructor({ previous, }) {
      this[previous] = previous;
    }

    /**
     * Internal method to build pipeline
     * @returns {Array} Return pipeline to execute
     */
    buildPipeline() {
      if (this.previous) {
        return this[previous].concat(this[definition]);
      }

      return [ this[definition], ];
    }

    /**
     * Execute the aggregate and return the results
     * @returns {Array} The aggregate result
     */
    async exec() {
      const pipeline = this.buildPipeline();
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
