'use strict';

function runForEachContext (context, handler) {
  if(context === null) {
    throw new Error('Context missing');
  }

  context = [].concat(context);
  context.forEach(handler);
  context = null;
}

module.exports = runForEachContext;