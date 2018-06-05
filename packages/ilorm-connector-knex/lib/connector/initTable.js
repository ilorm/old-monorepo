'use strict';

/**
 * Init model knex
 * @return {Promise} Resolve when is finished
 */
const initModel = async ({ connector, knex, }) => {
  const { tableName, } = connector;

  const tableExists = await knex.schema.hasTable(tableName);

  // If the table does not exists, create one from nothing
  if (!tableExists) {
    return knex.schema.createTable(tableName, () => {

    });
  }

  return null;
};

module.exports = initModel;
