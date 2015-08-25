'use strict';

var _ = require('lodash');
var Dispatcher = require('flux').Dispatcher;

function SafeDispatcher() {
    Dispatcher.call(this);
}

_.assign(SafeDispatcher.prototype, Dispatcher.prototype, {
    _queue: [],
    dispatch: function(action) {
        if (this.isDispatching()) {
            this._queue.push(action);
        } else {
            Dispatcher.prototype.dispatch.call(this, action);

            while (!_.isEmpty(this._queue)) {
                var task = this._queue.shift();
                Dispatcher.prototype.dispatch.call(this, task);
            }
        }
    }
});

module.exports = new SafeDispatcher();
