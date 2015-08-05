/**
 * Created by kevin on 7/3/15.
 */
'use strict';

// dependencies
var filter = require('./filter');
var userconfig = require('../userconfig/userconfig');

// exports
module.exports = filter.create({
    processWritable: function (value, options) {
        if (options.needToken && userconfig.getToken()) {
            value['tk'] = userconfig.getToken();
        }
        return value;
    }
});
