'use strict';

const relationship = require('../../model/relation');

const { FIELDS, SELECT_BEHAVIOR, } = require('ilorm-constants').QUERY;
const { CONNECTOR, LIMIT, LINKED_WITH, MODEL, SELECT, SKIP, UPDATE, } = FIELDS;

const queryBuilderMethod = require('./queryBuilder.method');
const proxyFactory = require('./proxyFactory');

const orMethod = require('./or.method');
const streamMethod = require('./stream.method');

/**
 * Class representing a queryBuilder
 * It's used by the framework to build query
 */
class BaseQuery {
  /**
   * Init the query object
   */
  constructor() {
    return proxyFactory(this);
  }

  /**
   * Restrict query to the related model
   * @param {Model|Array.<Model>} relatedModel The related model instance to restrict the query
   * @returns {Query} Return the current query
   */
  restrictToModel(relatedModel) {
    const relatedModelList = [].concat(relatedModel);

    const reference = relationship.getRelation({
      modelReference: this[MODEL].getName(),
      modelSource: relatedModelList[0].getName(),
    });

    // Simple case of reference
    // Query.key = model.PrimaryKey
    if (reference.referenceB === relationship.Primary) {
      this[reference.referenceA].isIn(relatedModelList.map(relatedModel => relatedModel.getPrimary()));

      return this;
    }

    if (reference.referenceA === relationship.Primary) {
      // Another simple case
      // Query.PrimaryKey = model.reference
      this.restrictToPrimary(relatedModelList.map(relatedModel => relatedModel[reference.referenceB]));

      return this;
    }

    this[reference.referenceA].isIn(relatedModelList.map(relatedModel => relatedModel[reference.referenceB]));

    return this;
  }

  /**
   * Declare field as linked with another query, model or ID.
   * @param {Model|Query} relatedElement Specify an element which be linked with the query result
   * @returns {Query} Return the query to make additional link or filters
   */
  linkedWith(relatedElement) {
    let query;
    
    if (relatedElement && relatedElement[MODEL]) {
      query = relatedElement;
    }

    if (!query && relatedElement && relatedElement.getName) {
      return this.restrictToModel(relatedElement);
    }
    if (!query) {
      throw new Error('linkedWith parameter is not valid, need to be an instanceof Query or Model');
    }

    this[LINKED_WITH] = query;

    return this;
  }

  /**
   * Find one instance from the query
   * @returns {Model} Return an instance of the linked model
   */
  async findOne() {
    await this.prepareQuery();

    const rawResult = await this[CONNECTOR].findOne(this);

    return this.applySelectBehaviorOnConnectorResult(rawResult);
  }

  /**
   * Find one or more instance
   * @returns {Array<Model>} Return an array of instance linked with the model
   */
  async find() {
    await this.prepareQuery();

    const rawResultList = await this[CONNECTOR].find(this);

    return rawResultList.map(rawResult => this.applySelectBehaviorOnConnectorResult(rawResult));
  }

  /**
   * Apply the primary key of the current query
   * @param {Mixed} primary The key to apply
   * @returns {Void} Return nothing
   */
  restrictToPrimary() {
    throw new Error('Required to be overload by connector query class');
  }

  /**
   * Convert raw result from connector find or findOne to instance or selected field
   * @param {Object} rawResult The raw result to convert
   * @returns {Object|null} The result in function of select behavior
   */
  applySelectBehaviorOnConnectorResult(rawResult) {
    // Without raw result, you return null to show the absence of value :
    if (!rawResult) {
      return null;
    }

    // Classic way, without select, you only instantiate the child model :
    if (this[SELECT].behavior === SELECT_BEHAVIOR.ALL) {
      return this[MODEL].instantiate(rawResult);
    }

    // queryField.selectOnly() will return only the field value :
    if (this[SELECT].behavior === SELECT_BEHAVIOR.ONE) {
      return rawResult[this[SELECT].fields[0]];
    }

    // queryField.select() it's the connector work to choose the select field :
    return rawResult;
  }

  /**
   * Declare the number of element to skip (the query will ignore this element).
   * @param {Number} nbElementToSkip The number of element to skip
   * @returns {Query} Return the query to make additional link or filters
   */
  skip(nbElementToSkip) {
    this[SKIP] = nbElementToSkip;

    return this;
  }

  /**
   * Declare the number of element to query (the query will only returns this elements).
   * @param {Number} nbElementToQuery The number of element to get
   * @returns {Query} Return the query to make additional link or filters
   */
  limit(nbElementToQuery) {
    this[LIMIT] = nbElementToQuery;

    return this;
  }

  /**
   * Count instance which match the query
   * @returns {Promise.<Number>} The number of instance which match the query
   */
  count() {
    return this.runQuery('count');
  }

  /**
   * Remove instance which match the query
   * @returns {*} TODO
   */
  remove() {
    return this.runQuery('remove');
  }

  /**
   * Remove one instance which match the query
   * @returns {*} TODO
   */
  removeOne() {
    return this.runQuery('removeOne');
  }

  /**
   * Update one or more element which match the query, with the current update state
   * @returns {*} TODO
   */
  update() {
    return this.runUpdate('update');
  }

  /**
   * Update one element which match the query, with the current update state
   * @returns {*} TODO
   */
  updateOne() {
    return this.runUpdate('updateOne');
  }

  /**
   * Run specific query operation on the current query
   * @param {String} connectorOperation The operation to run
   * @returns {Promise.<*>} The result of the operation
   */
  async runQuery(connectorOperation) {
    await this.prepareQuery();

    if (this[LINKED_WITH]) {
      this.restrictToModel(await this[LINKED_WITH].find());
    }

    return this[CONNECTOR][connectorOperation](this);
  }

  /**
   * Run specific update operation on the current query
   * @param {String} connectorOperation The operation to run
   * @returns {Promise.<*>} The result of the operation
   */
  async runUpdate(connectorOperation) {
    await this.prepareQuery();
    await this.prepareUpdate();

    if (this[LINKED_WITH]) {
      this.restrictToModel(await this[LINKED_WITH].find());
    }

    return this[CONNECTOR][connectorOperation](this);
  }

  /**
   * Helper to convert ilorm query object to query on the Connector side
   * @param {Function} onOr This function will be called if the user have calling an or on this query
   * @param {Function} onOperator This function will be called per every key operator value combination
   * @param {Function} onOptions This function will be called to put skip and limit to the child query
   * @param {Function} onSelect This function will be called to handle select specific fields from the database
   * @returns {void} Return nothing
   */
  queryBuilder({ onOr, onOperator, onOptions, onSelect, onSort, }) {
    return queryBuilderMethod(this)({
      onOr,
      onOperator,
      onOptions,
      onSelect,
      onSort,
    });
  }

  /**
   * Helper to convert ilorm query object to query on the Connector side
   * @param {Function} onOperator This function will be called per every key operator value combination
   * @returns {void} Return nothing
   */
  updateBuilder({ onOperator, }) {
    if (onOperator) {
      for (const { field, operator, value, } of this[UPDATE]) {
        onOperator(field, operator, value);
      }
    }
  }

  /**
   * Utility method called before each query, could be used to change query behavior
   * @returns {void} Return nothing, only change the internal state of query
   */
  async prepareQuery() {}

  /**
   * Utility method called before each update, could be used to change update behavior
   * @returns {void} Return nothing, only change the internal state of query
   */
  prepareUpdate() {}

  /**
   * Declare or field
   * @param {Function} handler be called back with a branch parameter using to create new branch
   * @returns {Query} Return current query to chain call
   */
  or(handler) {
    return orMethod(this)(handler);
  }

  /**
   * Create a stream of data returned by the query on the database
   * @returns {Promise.<Stream>} A readable stream to manipulate resulting data
   */
  stream() {
    return streamMethod(this);
  }
}

let Query = BaseQuery;

/**
 * Remove plugins from schema
 * @returns {void} return nothing
 */
const clear = () => {
  Query = BaseQuery;
};

/**
 * Get the current Query class
 * @returns {Query} Current query
 */
const getQuery = () => Query;

/**
 * Overload query class by another (to plugin)
 * @param {Function} classFactory The class factory used to replace current query
 * @returns {void} Return nothing
 */
const overload = classFactory => {
  Query = classFactory(Query);
};

module.exports = {
  clear,
  getQuery,
  overload,
};
