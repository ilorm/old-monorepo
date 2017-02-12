/**
 * Created by guillaume on 12/02/2017.
 */

/**
 * Instantiate a register plugin function
 * @param {Map} pluginsMap The plugin map to store plugin
 * @return {register} return the function to add plugin
 */
function injectPluginsMap(pluginsMap) {

  /**
   * Add a plugin to the current iLorm
   * @param {Function} plugin The plugin you want to add
   * @returns {undefined} return nothing
   */
  function register(plugin) {
    plugin(pluginsMap);
  }

  return register;
}

module.exports = injectPluginsMap;