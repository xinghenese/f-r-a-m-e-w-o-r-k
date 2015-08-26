/**
 * Created by kevin on 8/26/15.
 */
'use strict';

// exports
module.exports = {
    setBadge: function(app, badge) {
        if (app.dock && app.dock.setBadge) {
            app.dock.setBadge(badge);
        }
    }
};
