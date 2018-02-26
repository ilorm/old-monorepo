'use strict';

const relationship = require('../../model/relation');
const { MODEL, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Create the restrictToModel method from the query
 * @param {BaseQuery} query to use as base for the function.
 * @returns {Function} Return the restrictToModel method
 */
const restrictToModelMethod = query => relatedModel => {
  const relatedModelList = [].concat(relatedModel);

  const reference = relationship.getRelation({
    modelReference: query[MODEL].getName(),
    modelSource: relatedModelList[0].getName(),
  });

  // Simple case of reference
  // Query.key = model.PrimaryKey
  if (reference.referenceB === relationship.Primary) {
    query[reference.referenceA].isIn(relatedModelList.map(relatedModel => relatedModel.getPrimary()));

    return query;
  }

  if (reference.referenceA === relationship.Primary) {
    // Another simple case
    // Query.PrimaryKey = model.reference
    query.restrictToPrimary(relatedModelList.map(relatedModel => relatedModel[reference.referenceB]));

    return query;
  }

  query[reference.referenceA].isIn(relatedModelList.map(relatedModel => relatedModel[reference.referenceB]));

  return query;
};

module.exports = restrictToModelMethod;
