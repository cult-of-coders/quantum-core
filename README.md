Quantum Core
====================================

The framework of the future.


Using a plugin
==================================
There are 2 steps when using plugins:


Definition
=======
```
Q('service post', {
    definition: class {
       doThis() { return 'done'; }
    }
})
```

You can read more about it in the *quantum_service* package.

"service" = the name of the plugin
"post" = the name of the atom in the plugin

You can use "post" in another plugin but using it again in "service" will override it.
You are not allowed to use spaces in an atom name, but you can easily namespace your contents with ".", "_", camelCase.

Running the result
=======
```
R('service post').doThis()
```


Creating a plugin
================================

When creating a plugin we provide a name, and a plugin class.

You need to define a schema for what your plugin accepts
We are using SimpleSchema for that. Read more: https://github.com/aldeed/meteor-simple-schema


```
class Plugin extends Quantum.Model.Plugin {
   build(atom) {
       return atom.config.name;
   }
   // will require an object that contains the key name and it is a string
   schema() {
       return {
           name: {type: String}
       }
   }
}
```

```
Quantum.instance.plugin('randomPlugin', RandomPlugin)
```

```
Q('randomPlugin test', {name: 'xxx'})
Q('randomPlugin test') -> 'xxx'
```


Extending a plugin:
=========================
```
Q('template').extend({
    newConfigKey: { type: String }
}, function (atom) {
    let config = atom.config;

    // do something with config.newConfigKey
});

```

Declaring Plugin Dependencies
=============================

Specifically define requirements which are computed at boot:

```
requires() {
   return 'collection-hooks'; // or more ['collection-hooks', 'collection-exposure']
}
```


Built in global event manager
====================================
QF.on('event', handler)
QF.off('event', handler)

Todo
===============================
Entanglement. Provide relationships between plugins?
Allow a plugin to extend other plugin.