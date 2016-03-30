Package.describe({
    name: 'cultofcoders:quantum-core',
    version: '0.0.1',
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
        'meteor-base',
        'mobile-experience',
        'mongo',
        'templating',
        'blaze-html-templates',
        'session',
        'jquery',
        'tracker',
        'check',
        'reactive-var',
        'standard-minifiers',
        'es5-shim',
        'ecmascript',
        'underscore',
        'raix:eventemitter@0.1.3',
        'aldeed:simple-schema@1.5.3'
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
    api.use('cultofcoders:quantum-core');
    api.use('tinytest');

    api.addFiles('tests/lib/Atom.test.js');
    api.addFiles('tests/lib/Body.test.js');
    api.addFiles('tests/lib/Plugin.test.js');
});
