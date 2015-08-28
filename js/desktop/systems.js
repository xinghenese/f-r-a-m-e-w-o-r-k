/**
 * Created by kevin on 8/26/15.
 */
'use strict';

// exports
module.exports = {
    _ipc: null,
    ipcAsync: function(channel, message) {
        if (!this.isIpcAvailable()) {
            return;
        }

        this._getIpc().send(channel, message);
    },
    ipcSync: function(channel, message, alternative) {
        if (!this.isIpcAvailable()) {
            return alternative;
        }

        return this._getIpc().sendSync(channel, message) || alternative;
    },
    isIpcAvailable: function() {
        return !!this._getIpc();
    },
    setBadge: function(app, badge) {
        if (app.dock && app.dock.setBadge) {
            app.dock.setBadge(badge);
        }
    },
    _getIpc: function() {
        if (this._ipc) {
            return this._ipc;
        }

        if (!window.require) {
            return null;
        }

        this._ipc = window.require('ipc');
        return this._ipc;
    }
};
