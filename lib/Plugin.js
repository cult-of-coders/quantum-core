Quantum.Model.Plugin = class {
    /**
     * Plugin creation.
     */
    constructor() {
        this._atoms = [];
        this._currentConfig = {};

        Quantum.Model.Utils.eventify(this);

        let provideSchema = (schema) => {
            if (!schema) return undefined;

            if (schema instanceof SimpleSchema) {
                return schema;
            } else {
                return new SimpleSchema(schema)
            }
        };

        this._schema = provideSchema(this.schema());
        this._configSchema = provideSchema(this.configSchema());
    }

    /**
     *
     * @param name
     * @param config
     * @returns {Atom}
     */
    add(name, config) {
        let atom = new Quantum.Model.Atom(name, config, this);
        this._atoms.push(atom);

        if (this.executionContext() == 'instant') {
            this._buildAtom(atom);
        }

        return atom;
    }

    /**
     * checks if an atom with that name is registered
     *
     * @param name
     * @returns {*|any|Cursor|T}
     */
    has(name) {
        return _.find(this._atoms, (a) => {
            return a.name === name;
        })
    }

    /**
     * Ability to extend the behavior of other plugin.
     *
     * @param schema Object
     * @param handler Function
     * @param event String default "post:build"
     */
    extend(schema, handler, event = 'post:build') {
        this._extendSchema(schema, '_schema');
        this._eventManager.on(event, handler)
    }
    /**
     * Ability to extend the behavior of other plugin.
     *
     * @param schema Object
     * @param handler Function
     * @param event String default "post:config"
     */
    extendConfig(schema, handler, event = 'post:config') {
        this._extendSchema(schema, '_configSchema');
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
     * Specifically declare dependencies in order to function properly.
     *
     * @returns {undefined}
     */
    requires() { return undefined; }

    /**
     * Gets or sets the config.
     * If key is undefined returns the whole configuration
     */
    config(key) {
        if (key === undefined) {
            return this._currentConfig;
        }

        this._currentConfig[key] = optionalValue;

        return this;
    }

    /**
     * Validates the atom configuration and returns the simple schema context
     *
     * @param atom
     * @returns {*}
     */
    _validateAtom(atom) {
        if (this._schema) {
            let context = this._schema.newContext();
            context.validate(atom.config);

            if (!context.isValid()) {
                throw `Invalid configuration for atom with name: "${atom.name}" within plugin "${this._name}". Invalid keys: ${JSON.stringify(context.invalidKeys())}`
            }
        }
    }

    /**
     * Building an atom basically means storing a result in it.
     * @param atom
     */
    _buildAtom(atom) {
        this._validateAtom(atom);

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
     * @param fields
     * @param internalVariable
     */
    _extendSchema(fields, internalVariable) {
        if (!this[internalVariable]) {
            this[internalVariable] = new SimpleSchema(fields)
        }

        this[internalVariable] = new SimpleSchema([this[internalVariable], fields]);
    }

    /**
     * Some plugins can be configured customly.
     *
     * @param config
     * @returns {*}
     */
    _configure(config) {
        let schema = this._configSchema;

        if (schema) {
            check(config, this._configSchema);
        }

        this._currentConfig = config;

        this.emit('pre:config', config);
        this.configure(config);
        this.emit('post:config', config);
    }
};