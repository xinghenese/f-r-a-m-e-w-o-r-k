/**
 * Created by kevin on 7/3/15.
 */
'use strict';

// dependencies
var filter = require('./filter');

// exports
module.exports = filter.extend({
    processWritable: function (value, options) {
        var AccountStore = require('../../stores/accountstore');

        if (options.needToken && AccountStore.getProfile('tk')) {
            value['tk'] = AccountStore.getProfile('tk');
        }
        return value;
    }
});
