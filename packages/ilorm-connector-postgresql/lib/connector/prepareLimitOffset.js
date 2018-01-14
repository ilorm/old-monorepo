'use strict';

/**
 * Generate LIMIT and OFFSET part of a SQL query
 * @param {Number} [limit] The number of items to get
 * @param {Number} [offset] The index to start reading
 * @returns {String} The resulting query
 */
const prepareLimitOffset = ({ limit, offset, }) => {
  if (limit && offset) {
    return ` LIMIT ${limit} OFFSET ${offset}`;
  }
  if (limit) {
    return ` LIMIT ${limit}`;
  }
  if (offset) {
    return ` OFFSET ${offset}`;
  }

  return '';
};

module.exports = prepareLimitOffset;