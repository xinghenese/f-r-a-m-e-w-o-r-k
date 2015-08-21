/**
 * Created by Administrator on 2015/8/20.
 */
'use strict';

// dependencies
var config = require('../etc/config');

// private fields


// exports
module.exports = {
    getResourceUrl: function (url) {
        return url.indexOf(config.resourceDomain) > -1 ? url : config.resourceDomain + url;
    }
};

// module initialization


// private functions
