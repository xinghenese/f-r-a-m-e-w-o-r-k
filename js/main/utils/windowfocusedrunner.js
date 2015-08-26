/**
 * Created by kevin on 8/26/15.
 */
'use strict';

// dependencies
var _ = require('lodash');

// private fields
var runner = {
    _windowFocused: true,
    _tasks: [],
    _handleWindowFocused: function() {
        this._windowFocused = true;

        while (!_.isEmpty(this._tasks)) {
            var task = this._tasks.shift();
            task();
        }
    },
    _handleWindowBlurred: function() {
        this._windowFocused = false;
    },
    init: function() {
        window.addEventListener('focus', _.bind(this._handleWindowFocused, this));
        window.addEventListener('blur', _.bind(this._handleWindowBlurred, this));
    },
    destroy: function() {
        window.removeEventListener('focus', _.bind(this._handleWindowFocused, this));
        window.removeEventListener('blur', _.bind(this._handleWindowBlurred, this));
    },
    run: function(task) {
        if (this._windowFocused) {
            task();
        } else {
            this._tasks.push(task);
        }
    },
    cancel: function(task) {
        _.remove(this._tasks, function(each) {
            return each === task;
        });
    }
};

// exports
module.exports = runner;

// module initialization
runner.init();
