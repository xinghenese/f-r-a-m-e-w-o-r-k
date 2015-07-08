/**
 * Created by kevin on 7/7/15.
 */
'use strict';

// dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// exports
var MessageStore = assign({}, EventEmitter.prototype, {
    Events: {

    }
});