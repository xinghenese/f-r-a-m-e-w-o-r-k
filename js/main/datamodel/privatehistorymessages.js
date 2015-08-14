/**
 * Created by kevin on 7/9/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');
var originify = require('../net/base/originify');
var HistoryMessages = require('./historymessages');

// exports
var PrivateHistoryMessages = originify(HistoryMessages).extend({
    init: function(data) {
        HistoryMessages.call(this, data);
    },
    getUserId: function() {
        return parseInt(this._data["uid"]);
    }
});

module.exports = PrivateHistoryMessages;
