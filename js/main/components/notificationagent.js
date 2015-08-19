/**
 * Created by kevin on 8/19/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var EventTypes = require('../constants/eventtypes');
var emitter = require('../utils/eventemitter');
var notifier = require('node-notifier');

// exports
var NotificationAgent = {
    init: function() {
        emitter.on(EventTypes.NEW_MESSAGE_RECEIVED, _handleNewMessageReceived);
    }
};

module.exports = NotificationAgent;

// private functions
function _handleNewMessageReceived(message) {
    console.log("got new message");
    notifier.notify({
        title: message.getUserNickname(),
        message: message.getBriefText(),
        icon: "images/logo144.png",
        sound: true,
        wait: false
    });
}