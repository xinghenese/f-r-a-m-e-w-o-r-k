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
    parseMessageDirection: function(direction) {
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
    }
};

module.exports = MessageConstants;
