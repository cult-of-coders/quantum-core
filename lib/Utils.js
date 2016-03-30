Quantum.Model.Utils = {
    eventify: function (object) {
        object._eventManager = new EventEmitter();
        object.on = function (...args) {
            object._eventManager.on(...args)
        };
        object.off = function (...args) {
            object._eventManager.off(...args)
        };
        object.emit = function (...args) {
            object._eventManager.emit(...args)
        };
        object.once = function (...args) {
            object._eventManager.once(...args)
        }
    }
};