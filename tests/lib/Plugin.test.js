Tinytest.add('Testing atom validation', function (test) {
    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }

        schema() {
            return {
                name: {
                    type: String
                }
            }
        }
    };

    let validAtom = new Quantum.Model.Atom('name', {
        'name': 'ok'
    });
    let invalidAtom = new Quantum.Model.Atom('name', {});

    let plugin = new samplePluginClass();

    test.isTrue(plugin.isValid(validAtom));
    test.isFalse(plugin.isValid(invalidAtom));
});

Tinytest.add('Testing atom adding', function (test) {
    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }
    };

    let plugin = new samplePluginClass();

    let atom = plugin.add('test', {});

    test.instanceOf(atom, Quantum.Model.Atom);
    test.isTrue(atom.isBuilt());

    test.equal(plugin._findAtom('test'), atom)
});

Tinytest.add('Testing building based on lazy context', function (test) {
    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }
        executionContext() {
            return 'lazy';
        }
    };

    let plugin = new samplePluginClass();

    let atom = plugin.add('test', {});

    test.instanceOf(atom, Quantum.Model.Atom);
    test.isFalse(atom.isBuilt());

    plugin.get('test');
    test.isTrue(atom.isBuilt());
});