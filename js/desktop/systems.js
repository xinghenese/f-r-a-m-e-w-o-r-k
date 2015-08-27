/**
 * Created by kevin on 8/26/15.
 */
'use strict';

// exports
module.exports = {
    ipcSync: function(channel, message) {
        if (!this.isIpcAvailable()) {
            return null;
        }

        var ipc = window.require('ipc');
        return ipc.sendSync(channel, message);
    },
    isIpcAvailable: function() {
        return window.require && window.require('ipc');
    },
    setBadge: function(app, badge) {
        if (app.dock && app.dock.setBadge) {
            app.dock.setBadge(badge);
        }
    }
};
