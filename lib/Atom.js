/**
 * Atoms represent the fact that a plugin has been used
 *
 * @type {$ES6_ANONYMOUS_CLASS$}
 */
Quantum.Model.Atom = class {
    constructor(name, config, plugin) {
        this.plugin = plugin;
        this.config = config;
        this.name = name;
        this.result = null;
        Quantum.Model.Utils.eventify(this);
    }

    /**
     * Depending on the loading context, we may want to build atoms later then when they are defined.
     */
    markAsBuilt() { this._built = true }

    /**
     * Checks if it is built
     * @returns {boolean}
     */
    isBuilt() { return this._built || false}

    /**
     * Allow extendability for atom. Quantum.instance.use('plugin', 'atomname', true).extend({...})
     *
     * @param args
     */
    extend(...args) {
        _.extend(this, ...args);
    }

    /**
     * Override result if necessary for extension.
     * @param result
     * @private
     */
    storeResult(result) {
        this.result = result;
    }
};