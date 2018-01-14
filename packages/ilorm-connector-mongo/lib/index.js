/**
 * Created by guil_ on 07/12/2017.
 */

const connector = require('./connector');


/**
 * Create the Connector from the given database
 * @param {MongoClient} database The database to use
 * @returns {Connector} The MongoDB connector object
 */
const fromClient = database => connector({ db: database, });

module.exports = {
  plugins: {},
  fromClient,
};

