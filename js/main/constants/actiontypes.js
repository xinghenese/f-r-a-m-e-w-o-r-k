'use strict';

var keyMirror = require('keymirror');

var ActionTypes = keyMirror({
    CHECK_PHONE_STATUS: null,
    CHECK_VERIFICATION_CODE: null,
    GET_CHAT_LIST: null,
    LOGIN: null,
    LOGOUT: null,
    REGISTER: null,
    REQUEST_GROUP_MEMBERS: null,
    REQUEST_HISTORY_MESSAGES: null,
    REQUEST_VERIFICATION_CODE: null,
    REQUEST_VOICE_VERIFICATION_CODE: null
});

module.exports = ActionTypes;
