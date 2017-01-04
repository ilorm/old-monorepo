/**
 * Created by guil_ on 29/12/2016.
 */

const convertIlormQueryToMongoQuery = require('./convertIlormQueryToMongoQuery');
const convertIlormUpdateToMongoUpdate = require('./convertIlormUpdateToMongoUpdate');

function injectDependencies({ db }) {
  const collection = db.collection('target');

  class Connector {

    create(docs) {
      return collection.insertMany(docs);
    }

    find(query) {
      return new Promise(function (resolve, reject) {
        const mongoQuery = convertIlormQueryToMongoQuery(query);

        collection.find(mongoQuery)
          .toArray((err, docs) => {
            if(err) {
              return reject(err);
            }
            resolve(docs);
          });
      });
    }

    findOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.findOne(mongoQuery);
    }

    count(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.count(mongoQuery);
    }

    update({query, update}) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);
      const mongoUpdate = convertIlormUpdateToMongoUpdate(update);

      return collection.updateMany(mongoQuery, mongoUpdate);
    }

    updateOne({query, update}) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);
      const mongoUpdate = convertIlormUpdateToMongoUpdate(update);

      return collection.findOneAndUpdate(mongoQuery, mongoUpdate);
    }

    remove(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.deleteMany(mongoQuery);
    }

    removeOne(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.findOneAndDelete(mongoQuery);

    }

    stream(query) {
      const mongoQuery = convertIlormQueryToMongoQuery(query);

      return collection.find(mongoQuery).stream();
    }
  }

  return Connector;
}

module.exports = injectDependencies;