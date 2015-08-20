/**
 * Created by kevin on 7/9/15.
 */
'use strict';

// dependencies
var objects = require('../utils/objects');

// exports
var MessageConstants = {
    MESSAGE_CONFIRM_TIMEOUT: 5 * 60 * 1000, // 5 minutes
    Direction: {
        NEW_TO_OLD: 1,
        OLD_TO_NEW: 2
    },
    parseMessageDirection: function (direction) {
        if (objects.isIntValue(direction, this.Direction.NEW_TO_OLD)) {
            return this.Direction.NEW_TO_OLD;
        }
        return this.Direction.OLD_TO_NEW;
    },
    Status: {
        UNKNOWN: -1,
        SENDING: 0,
        RECEIVED: 1,
        READ: 2,
        FAILED: 3,
        SENDING_ATTACHMENT: 4,
        SENT: 5
    },
    MessageTypes: {
        TEXT: 0,
        PICTURE: 1,
        AUDIO: 2,
        LOCATION: 3,
        VIBRATION: 4,
        SYSTEM: 5,
        EMOTION: 6,
        PREDEFINED: 7,
        CONTACT: 10,
        GROUP_CARD: 11
    },
    SystemMessageTypes: {
        COMMON_USED: 1,
        INVITED_INTO_GROUP: 100,
        USER_INVITED_INTO_GROUP: 101,
        GROUP_NAME_CHANGED: 104
    }
};

module.exports = MessageConstants;
