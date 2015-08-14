/**
 * Created by kevin on 7/8/15.
 */
'use strict';

/**
 * @see http://wiki.topcmm.net/doku.php?id=wiki:httpobject#room_message_object
 * @type {exports|module.exports}
 * @private
 */

// dependencies
var _ = require('lodash');
var objects = require('../utils/objects');
var originify = require('../net/base/originify');
var HistoryMessages = require('./historymessages');

// exports
var GroupHistoryMessages = originify(HistoryMessages).extend({
    init: function(data) {
        HistoryMessages.call(this, data);
    },
    getGroupId: function() {
        return parseInt(this._data["rid"]);
    }
});

module.exports = GroupHistoryMessages;
