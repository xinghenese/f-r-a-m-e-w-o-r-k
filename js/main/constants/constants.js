'use strict';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHECK_PHONE_STATUS: null,
        CHECK_VERIFICATION_CODE: null,
        LOGIN: null,
        LOGOUT: null,
        REGISTER: null,
        REQUEST_VERIFICATION_CODE: null,
        REQUEST_VOICE_VERIFICATION_CODE: null
    })
};
