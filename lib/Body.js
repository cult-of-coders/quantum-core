/**
 * @class {Quantum.Model.Body}
 */
Quantum.Model.Body = class {
    /**
     * Constructs the body where plugins can be added.
     */
    constructor(name = 'core') {
        this._name = name;
        this.registeredPlugins = {};
        Quantum.Model.Utils.eventify(this);
    }
    /**
     * Creates a plugin and adds it to this instance
     *
     * @param name
     * @param pluginClass
     * @returns {*}
     */
    plugin(name, pluginClass) {
        if (pluginClass === undefined) {
            return this.registeredPlugins[name];
        }

        let plugin = new pluginClass();
        plugin._name = name;

        this.registeredPlugins[name] = plugin;
    }

    /**
     * Here we add a plugin.
     *
     * @param pluginName
     * @param name
     * @param config
     * @returns {Set.<T>}
     */
    add(pluginName, name, config = {}) {
        let plugin = this.registeredPlugins[pluginName];

        if (plugin instanceof Quantum.Model.Plugin) {
            return plugin.add(name, config);
        }

        throw `The plugin ${pluginName} is not a valid plugin.`
    }

    /**
     * Returns the result of an atom execution. The result is usually something re-usable throughout the app.
     *
     * @param pluginName
     * @param atomName
     * @param fullAtom
     *
     * @returns {*}
     */
    use(pluginName, atomName, fullAtom = false) {
        let plugin = this.registeredPlugins[pluginName];

        if (plugin instanceof Quantum.Model.Plugin) {
            let atom = plugin._getAtom(atomName);
            if (!atom) {
                throw `Could not find atom: "${atom}" in the plugin: "${pluginName}"`
            }

            if (fullAtom) {
                return atom;
            }

            return atom.result;
        }

        throw `The plugin ${pluginName} is not a valid plugin.`
    }

    /**
     * Build non-instant and non-lazy plugins based on their context
     * @param context
     */
    buildPluginAtoms(context) {
        _.each(this.registeredPlugins, (plugin) => {
            if (plugin.executionContext() == context) {
                plugin._buildAllAtoms()
            }
        })
    }

    /**
     * Booting the body
     */
    boot() {
        this.buildPluginAtoms('boot')
    }
};



