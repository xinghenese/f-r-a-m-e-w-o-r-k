/**
 * Created by kevin on 6/27/15.
 */
'use strict';

var _ = require('lodash');

var SmartSlot = {
    _listeners: [],
    componentWillMount: function() {
        _(_listeners).forEach(function(n) {
            var host = n.host;
            var event = n.event;
            var listener = n.listener;
            host.on(event, listener);
        });
    },
    componentWillUnmount: function() {
        _(_listeners).forEach(function(n) {
            var host = n.host;
            var event = n.event;
            var listener = n.listener;
            host.removeListener(event, listener);
        });
        _listeners = [];
    },
    registerListener: function(host, event, listener) {
        _listeners.push({
            host: host,
            event: event,
            listener: listener
        });
    }
};

module.exports = SmartSlot;