/**
 * Created by kevin on 8/31/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var general = require('./general');

// exports
module.exports = _.assign(general, {
    setBadge: function(app, mainWindow, badge) {
        if (badge && mainWindow && mainWindow.flashFrame) {
            mainWindow.flashFrame(true);
        }
    }
});

// module initialization


// private functions