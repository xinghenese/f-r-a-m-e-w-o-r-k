/**
 * Created by kevin on 7/22/15.
 */
'use strict';

var Lang = require('../locales/zh-cn');
var _ = require('lodash');

// exports
module.exports = {
    formatTime: function (milliseconds) {
        return (
            milliseconds
                ? _.isDate(milliseconds)
                    ? milliseconds
                    : new Date(milliseconds)
                : new Date()
        )
            .toTimeString()
            .replace(/\s.*$/, '');
    }
};
