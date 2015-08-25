/**
 * Created by kevin on 8/19/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var EventTypes = require('../main/constants/eventtypes');
var MessageStore = require('../main/stores/messagestore');
var globalEmitter = require('../main/events/globalemitter');
var ipc = null;

// exports
var NotificationAgent = {
    init: function() {
        globalEmitter.on(EventTypes.NEW_MESSAGE_RECEIVED, _handleNewMessageReceived);
        globalEmitter.on(EventTypes.UPDATE_DOCK_BADGE, _handleUpdateDockBadge);
        MessageStore.addChangeListener(_handleUnreadCountChange);
    }
};

module.exports = NotificationAgent;

// private functions
function _handleNewMessageReceived(message) {
    if (document.hasFocus()) {
        return;
    }

    new Notification(message.getUserNickname(), {
        body: message.getBriefText()
    });
}

function _handleUnreadCountChange() {
    var badge;
    var count = MessageStore.getUnreadCount();
    if (count <= 0) {
        badge = "";
    } else {
        badge = count.toString();
    }
    _ipcAsync(EventTypes.UPDATE_DOCK_BADGE, badge);
}

function _handleUpdateDockBadge(badge) {
    _ipcAsync(EventTypes.UPDATE_DOCK_BADGE, badge);
}

function _ipcAsync(channel, message) {
    if (!ipc && window.require) {
        ipc = window.require('ipc');
    }

    ipc.send(channel, message);
}
