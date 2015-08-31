/**
 * Created by kevin on 8/31/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var general = require('./general');

// exports
module.exports = _.create(general, {
    setBadge: function(app, mainWindow, dir, badge) {
        if (app.dock && app.dock.setBadge) {
            app.dock.setBadge(badge);
        }
    }
});
