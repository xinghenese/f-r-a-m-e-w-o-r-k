/**
 * Created by kevin on 8/19/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var EventTypes = require('../main/constants/eventtypes');
var globalEmitter = require('../main/events/globalemitter');
var notifier = require('node-notifier');

// exports
var NotificationAgent = {
    init: function() {
        globalEmitter.on(EventTypes.NEW_MESSAGE_RECEIVED, _handleNewMessageReceived);
    }
};

module.exports = NotificationAgent;

// private functions
function _handleNewMessageReceived(message) {
    /*
    notifier.notify({
        title: message.getUserNickname(),
        message: message.getBriefText(),
        icon: "images/logo144.png",
        sound: true,
        wait: false
    });
    */
    globalEmitter.emit(EventTypes.SHOW_NOTIFICATION, {
        title: message.getUserNickname(),
        message: message.getBriefText()
    });
}