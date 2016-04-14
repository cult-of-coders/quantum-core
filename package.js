Package.describe({
    name: 'cultofcoders:quantum-core',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'The core of quantum where plugins are registered and used.',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/cult-of-coders/quantum-core.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    var packages = [
        'ecmascript',
        'underscore',
        'raix:eventemitter@0.1.3',
        'aldeed:simple-schema@1.5.3',
        'underscorestring:underscore.string@3.3.4'
    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'namespaces.js',
        'lib/Utils.js',
        'lib/Atom.js',
        'lib/Body.js',
        'lib/Plugin.js',
        'export.js'
    ]);

    api.export(['QF', 'Q', 'Quantum']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('cultofcoders:quantum-core@1.0.0');
    api.use('tinytest');

    api.addFiles('tests/lib/Atom.test.js');
    api.addFiles('tests/lib/Body.test.js');
    api.addFiles('tests/lib/Plugin.test.js');
});
