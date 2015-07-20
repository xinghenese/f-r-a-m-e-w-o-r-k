/**
 * Created by kevin on 7/9/15.
 */
'use strict';

// dependencies
var objects = require('../utils/objects');

// exports
var MessageConstants = {
    MESSAGE_CONFIRM_TIMEOUT: 5 * 60 * 1000, // 5 minutes
    NEW_TO_OLD: 1,
    OLD_TO_NEW: 2,
    parseMessageDirection: function(direction) {
        if (objects.isIntValue(direction, this.NEW_TO_OLD)) {
            return this.NEW_TO_OLD;
        }
        return this.OLD_TO_NEW;
    }
};

module.exports = MessageConstants;
