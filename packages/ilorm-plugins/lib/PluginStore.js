/**
 * Created by guillaume on 12/02/2017.
 */

/**
 * The IlormPluginStore store every plugins linked with a project
 */
class IlormPluginStore {
  /**
   * Create an IlormPluginStore instance
   * init the pluginsHandler to an empty object
   */
  constructor() {
    this.pluginsHandler = {};
  }

  /**
   * Register a new handler to an ilorm context
   * @param {String} contextName The context where the handler will be called
   * @param {Function} handler handler defined by the plugin
   * @return {IlormPluginStore} return the IlormPluginStore for chained call
   */
  register(contextName, handler) {
    if (!this.pluginsHandler[contextName]) {
      this.pluginsHandler[contextName] = [];
    }
    this.pluginsHandler.push(handler);

    return this;
  }

  /**
   * Run every handler binded with a context
   * @param {String} contextName The context where the handler will be called
   * @param {Object} params The current params used in the context
   * @param {Number} [index=0] The current call of the run
   * @returns {Promise.<Object>} The transformed params
   */
  run(contextName, params, index = 0) {
    if (!this.pluginsHandler[contextName] || this.pluginsHandler[contextName].length <= index) {
      return Promise.resolve(params);
    }

    return this.pluginsHandler[contextName][index](params)
      .then(transformedParams => run(contextName, transformedParams, index++));
  }
}

module.exports = IlormPluginStore;
