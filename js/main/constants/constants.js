define(function(require, exports, module) {
    'use strict';

    var keyMirror = require('keymirror');

    module.exports = {
        ActionTypes: keyMirror({
            CHECK_PHONE_STATUS: null,
            LOGIN: null
        })
    };
});
