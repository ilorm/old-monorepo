/**
 * Created by guillaume on 12/02/2017.
 */

const PluginStore = require('./PluginStore');
const pluginStore = new PluginStore();
const register = require('./registerPlugins')(pluginStore);

const ilormPlugins = {
  register,
  run: pluginStore.run,
};

module.exports = ilormPlugins;
