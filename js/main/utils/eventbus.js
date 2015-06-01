'use strict';

var EventBusClass = function() {
    this.listeners = {};
};

EventBusClass.prototype = {
    addListener: function(type, callback, scope) {
        var listener = {callback: callback, scope: scope};
        if (typeof this.listeners[type] != "undefined") {
            this.listeners[type].push(listener);
        } else {
            this.listeners[type] = [listener];
        }
    },
    removeListener: function(type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            this.listeners[type] = this.listeners[type].filter(function(listener) {
                return listener.callback != callback || this.listeners.scope != scope;
            }.bind(this));
        }
    },
    hasListener: function(type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            return this.listeners[type].some(function(listener, index, array) {
                return listener.callback == callback && listener.scope == scope;
            });
        }
        return false;
    },
    dispatch: function(type) {
        var args = [];
        var numOfArgs = arguments.length;
        for (var i = 1; i < numOfArgs; i++) {
            args.push(arguments[i]);
        }

        if (typeof this.listeners[type] != "undefined") {
            var count = this.listeners[type].length;
            for (var j = 0; j < count; j++) {
                var listener = this.listeners[type][j];
                if (listener && listener.callback) {
                    listener.callback.apply(listener.scope, args);
                }
            }
        }
    }
};

module.exports = new EventBusClass();
