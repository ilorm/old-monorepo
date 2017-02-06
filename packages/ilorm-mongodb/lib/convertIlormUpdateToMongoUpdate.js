'use strict';

const fields = [ '$set', '$inc', ];
const convert = {
  INC: '$inc',
  SET: '$set',
};

/**
 * Convert a valid update ilorm query to an update mongo query.
 * @param {Object} ilormUpdate The ilorm query you want to convert
 * @returns {Object} The result mongo Query.
 */
function convertIlormQueryToMongoQuery (ilormUpdate) {
  if (!ilormUpdate || ilormUpdate.length === 0) {
    return {};
  }

  const updated = {};
  const updateMongo = {};

  fields.forEach(field => {
    updateMongo[field] = {};
    updated[field] = 0;
  });

  ilormUpdate.forEach(currentIlormUpdate => {
    const mongoOperator = convert[currentIlormUpdate.operator] || null;

    if (!mongoOperator) {
      throw new Error('Connector.MongoDB', 'UNDEFINED OPERATOR : ', currentIlormUpdate.operator);
    }
    updated[mongoOperator]++;
    updateMongo[mongoOperator] = { [currentIlormUpdate.context]: currentIlormUpdate.value, };
  });

  fields.forEach(field => {
    if (updated[field] === 0) {
      delete updateMongo[field];
    }
  });

  return updateMongo;
}

module.exports = convertIlormQueryToMongoQuery;