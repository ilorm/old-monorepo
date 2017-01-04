'use strict';


function convertIlormQueryToMongoQuery (ilormUpdate) {
  if(!ilormUpdate || ilormUpdate.length === 0) {
    return {};
  }
  let set = 0;
  let inc = 0;
  const update = {
    $set: {},
    $inc: {}
  };

  ilormUpdate.forEach(currentIlormUpdate => {
    if(currentIlormUpdate.operator === 'INC') {
      inc++;
      update.$inc[currentIlormUpdate.context] = currentIlormUpdate.value;
    }
    if(currentIlormUpdate.operator === 'SET') {
      set++;
      update.$set[currentIlormUpdate.context] = currentIlormUpdate.value;
    }
  });

  if(set === 0) {
    delete update.$sec;
  }
  if(inc === 0) {
    delete update.$inc;
  }
  return update;
}

module.exports = convertIlormQueryToMongoQuery;