Tinytest.add('Creating a simple plugin', function (test) {
    let instance = new Quantum.Model.Body();

    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }
    };

    instance.plugin('test_plugin', samplePluginClass);
    instance.add('test_plugin', 'testItem', {});

    test.equal('ok', instance.use('test_plugin', 'testItem'))
});

Tinytest.add('Checking if a plugin is lazy loaded', function (test) {
    let instance = new Quantum.Model.Body();

    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }

        executionContext() { return 'lazy' }
    };

    instance.plugin('test_plugin', samplePluginClass);
    instance.add('test_plugin', 'testItem', {});

    let atom = instance.plugin('test_plugin')._findAtom('testItem');
    test.isNotNull(atom);
    test.isNotUndefined(atom);

    test.equal(null, atom.result);
    test.equal('ok', instance.use('test_plugin', 'testItem'));
    test.equal('ok', atom.result);
});

Tinytest.add('Creating a boot plugin', function (test) {
    let instance = new Quantum.Model.Body();

    let samplePluginClass = class extends Quantum.Model.Plugin {
        build(atom) {
            return 'ok';
        }

        executionContext() { return 'boot' }
    };

    instance.plugin('test_plugin', samplePluginClass);
    instance.add('test_plugin', 'testItem', {});

    let atom = instance.plugin('test_plugin')._findAtom('testItem');

    test.equal(null, atom.result);
    instance.boot();

    test.equal('ok', atom.result);
    test.equal('ok', instance.use('test_plugin', 'testItem'))
});