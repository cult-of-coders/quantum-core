Tinytest.add('Atom Creation', function (test) {
    let atom = new Quantum.Model.Atom('name', {
        randomConfig: test
    });

    test.isFalse(atom.isBuilt());
    atom.markAsBuilt();
    test.isTrue(atom.isBuilt());
});