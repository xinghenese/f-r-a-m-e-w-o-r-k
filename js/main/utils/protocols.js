/**
 * Created by kevin on 7/28/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var objects = require('./objects');

// exports
module.exports = {
    toConversationType: function (type) {
        if (type === "group") {
            return 0;
        }
        return 1;
    }
};
