'use strict';

const operatorConversion = {
  'EQUAL': '$eq',
  'NOT_EQUAL': '$ne',
  'MIN': '$gt',
  'MAX': '$lt'
};

function convertIlormQueryToMongoQuery (iLormQuery) {
  if(!iLormQuery || iLormQuery.length === 0) {
    return {};
  }
  return {
    $and: iLormQuery.map(queryElement => {
      if(operatorConversion[queryElement.operator]) {
        const operator = operatorConversion[queryElement.operator];

        return {
          [queryElement.context]: {
            [operator]: queryElement.value
          }
        };
      }

      if(queryElement === 'BETWEEN') {
        return {
          [queryElement.context]: {
            $gt: queryElement.value.min,
            $lt: queryElement.value.max
          }
        };
      }

      throw new Error('Connector.MongoDB', 'UNDEFINED OPERATOR : ', queryElement.operator);
    })
  };
}

module.exports = convertIlormQueryToMongoQuery;