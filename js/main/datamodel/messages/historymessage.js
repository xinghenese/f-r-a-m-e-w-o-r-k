/**
 * Created by Administrator on 2015/9/9.
 */
'use strict';

var model = require('../model');
var message = require('./message');
var KeyInfo = require('../keyinfo');

var messages = model;

module.exports = model.extend({
    keyMap: {
        unreadCount:    new KeyInfo('urc', Number, KeyInfo.NUMBER_ZERO),
        hasEnded:       new KeyInfo('ise', Boolean),
        endedTimeType:  new KeyInfo('edt', Number),
        readCursor:     new KeyInfo('rcs', Number, KeyInfo.NUMBER_ZERO),
        cleanCursor:    new KeyInfo('ccs', Number, KeyInfo.NUMBER_ZERO),
        messages:       new KeyInfo('tms', model.arrayOf(message))
    }
});
