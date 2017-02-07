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
    hook[OPERATION] = initBeforeAfterList();
  });

  hook.addBefore = addFactory(hook, 'before');
  hook.addAfter = addFactory(hook, 'after');
  hook.run = run;

  /**
   * Run all hook functions
   * @param {String} operation The current operation (insert, find, remove, update)
   * @param {String} position If it's a before or a after hook
   * @param {Object} params The system parameters, who go thought the hook
   * @param {Number} index index for recursive call
   * @return {Promise.<TResult>|*} Return the transformed params
   */
  function run({ operation, position, params, index = 0, }) {
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

  return hook;
}

/**
 * Init two array
 * @return {{before: Array, after: Array}} The two array of function
 */
function initBeforeAfterList() {
  return {
    before: [],
    after: [],
  };
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

module.exports = initHook;
