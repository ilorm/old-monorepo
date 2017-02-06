'use strict';

/**
 * Run an handler for each context
 * @param {Array|*} context The context you want to run
 * @param {Function} handler The handler you want to use
 * @returns {undefined} The function return nothing
 */
function runForEachContext(context, handler) {
  if (context === null) {
    throw new Error('Context missing');
  }

  context = [].concat(context);
  context.forEach(handler);
  context = null;
}

module.exports = runForEachContext;
