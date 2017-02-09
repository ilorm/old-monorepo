/**
 * Created by guillaume on 08/02/2017.
 */

const OPERATIONS = [
  'insert',
  'find',
  'remove',
  'update',
];

/**
 * Build the hook object. You can use to add special comportment on the model.
 * @return {{}} The hook object
 */
function initHook() {
  const hook = {};

  OPERATIONS.forEach(OPERATION => {
    hook[OPERATION] = initBeforeAfterList(hook, OPERATION);
  });

  hook.addBefore = addFactory(hook, 'before');
  hook.addAfter = addFactory(hook, 'after');

  return hook;
}

/**
 * Generate for each operation two hook store, and two hook run.
 * @param {Object} hook The target hook store
 * @param {String} operation before or after
 * @return {{before: Array, after: Array, runBefore: run, runAfter: run}} Handler to use hook per operation
 */
function initBeforeAfterList(hook, operation) {
  const beforeAfter = {
    before: [],
    after: [],
    runBefore: runFactory(hook, operation, 'before'),
    runAfter: runFactory(hook, operation, 'after'),
  };

  beforeAfter.run = params => (
    beforeAfter.runBefore({ params, })
      .then(convertedOptions => (
        convertedOptions.handler(convertedOptions.params)
          .then(result => {
            if (convertedOptions.multiple) {
              return Promise.all(result.map(resultElem => beforeAfter.runAfter({ params: resultElem, })));
            }

            return beforeAfter.runAfter({ params: result, });
          })
      ))
  );

  return beforeAfter;
}

/**
 * Generate an add fonction
 * @param {Object} hook The target hook store
 * @param {String} positionOfHook before or after
 * @return {Function} add The add function
 */
function addFactory(hook, positionOfHook) {
  return function add(handler) {
    OPERATIONS.forEach(OPERATION => {
      if (handler[OPERATION]) {
        hook[OPERATION][positionOfHook] = hook[OPERATION][positionOfHook].concat(handler[OPERATION]);
      }
    });
  };
}

/**
 * Generate a run function
 * @param {Object} hook The target hook store
 * @param {String} operation The operation to run (find, update, remove, insert)
 * @param {String} position before or after
 * @return {run} Return a run Function
 */
function runFactory(hook, operation, position) {
  /**
   * Run all hook functions
   * @param {Object} params The system parameters, who go thought the hook
   * @param {Number} index index for recursive call
   * @return {Promise.<TResult>|*} Return the transformed params
   */
  return function run({ params, index = 0, }) {
    if (hook[operation][position].length <= index) {
      return Promise.resolve(params);
    }

    const result = hook[operation][position](params);

    return (result instanceof Promise ? result : Promise.resolve(result))
      .then(transformedParams => run({
        operation,
        position,
        transformedParams,
        index: index + 1,
      }));
  }
}

module.exports = initHook;
