Quantum.Model.Plugin = class {
    constructor() {
        this._atoms = [];
        this._currentConfig = {};

        Quantum.Model.Utils.eventify(this);
        this._schema = undefined;

        if (this.schema()) {
            if (this.schema() instanceof SimpleSchema) {
                this._schema = this.schema();
            } else {
                this._schema = new SimpleSchema(this.schema())
            }
        }
    }

    /**
     * Checks if the configuration is valid based on plugin's schema
     *
     * @param atom
     * @returns {*}
     */
    isValid(atom) {
        if (this._schema) {
            return Match.test(atom.config, this._schema)
        }

        return true;
    }

    /**
     *
     * @param name
     * @param config
     * @returns {Atom}
     */
    add(name, config) {
        let atom = new Quantum.Model.Atom(name, config);
        this._atoms.push(atom);

        if (this.executionContext() == 'instant') {
            this._buildAtom(atom);
        }

        return atom;
    }

    /**
     * Building an atom basically means storing a result in it.
     * @param atom
     */
    _buildAtom(atom) {
        if (!this.isValid(atom)) {
            throw `Invalid configuration for atom with name: "${atom.name}" within plugin "${this._name}"`
        }

        this._eventManager.emit('pre:build', atom);
        atom.result = this.build(atom);
        this._eventManager.emit('post:build', atom);

        atom.markAsBuilt();
    }

    /**
     * As the name implies, builds all atoms if
     */
    _buildAllAtoms() {
        _.each(this._atoms, (atom) => {
            if (!atom.isBuilt()) {
                this._buildAtom(atom)
            }
        })
    }

    /**
     * Finds atom based on name.
     *
     * @param name
     * @returns {any|Cursor|T}
     */
    _findAtom(name) {
        return _.find(this._atoms, x => x.name == name);
    }

    /**
     * Gets an atom and builds it if not built.
     *
     * @param name
     * @returns {any|Cursor|T}
     */
    _getAtom(name) {
        let atom = this._findAtom(name);

        if (!atom) {
            throw `Cannot find any atom with name: "${name}" within plugin "${this._name}"`
        }

        if (!atom.isBuilt()) {
            this._buildAtom(atom);
        }

        return atom;
    }

    /**
     *
     * @param fields
     * @returns {SimpleSchema}
     */
    _extendSchema(fields) {
        if (!this._schema) {
            return this._schema = new SimpleSchema(fields)
        }

        this._schema = new SimpleSchema([this._schema, fields]);
    }

    /**
     * Ability to extend the behavior of other plugin.
     *
     * @param schema Object
     * @param handler Function
     * @param event String default "post:build"
     */
    extend(schema, handler, event = 'post:build') {
        this._extendSchema(schema);
        this._eventManager.on(event, handler)
    }

    /**
     * @returns {string} instant|boot|lazy
     */
    executionContext() {
        return 'instant';
    }

    /**
     * This method transforms the atom configuration into a result.
     * @params atom
     */
    build(atom) {
        throw 'Override the "build" this method.'
    }

    /**
     * Optionally we can specify a theme.
     * @returns {SimpleSchema|undefined}
     */
    schema() {
        return undefined;
    }

    /**
     * Wether the plugin can be configured with a set of parameters.
     * @returns {boolean}
     */
    isConfigurable() {
        return false;
    }

    /**
     * Wether the plugin can be configured with a set of parameters.
     * @returns {boolean}
     */
    configSchema() {
        return undefined;
    }

    /**
     * How to configure your application
     * Is used by _configure method which is called.
     *
     * @param config
     * @returns {undefined}
     */
    configure(config) {
        return undefined;
    }

    /**
     * Gets or sets the config.
     * If key is undefined returns the whole configuration
     * If key is defined and optionalValue is defined it sets the value to the currentConfig
     * If key is defined and optionalValue undefined, it returns the value of that key
     */
    config(key, optionalValue) {
        if (key === undefined) {
            return this._currentConfig;
        }

        if (optionalValue === undefined) {
            // getting the key.
            return this._currentConfig[key];
        }

        this._currentConfig[key] = optionalValue;

        return this;
    }

    /**
     * Some plugins can be configured customly.
     *
     * @param config
     * @returns {*}
     */
    _configure(config) {
        if (!this.isConfigurable()) {
            return;
        }

        let schema = this.configSchema();

        if (schema && !(schema instanceof SimpleSchema)) {
            schema = new SimpleSchema(schema);
        }

        if (schema) {
            check(config, this.configSchema());
        }

        this._currentConfig = config;

        return this.configure(config);
    }
};