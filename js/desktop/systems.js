/**
 * Created by kevin on 8/26/15.
 */
'use strict';

// exports
module.exports = {
    _ipc: null,
    _osdeps: null,
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
    setBadge: function(app, mainWindow, dir, badge) {
        this._getOsDeps().setBadge(app, mainWindow, dir, badge);
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
    },
    _getOsDeps: function() {
        if (!this._osdeps) {
            if (process.platform == "darwin") {
                this._osdeps = require('./osdeps/osx');
            } else if (process.platform == "win32") {
                this._osdeps = require('./osdeps/win32');
            } else {
                this._osdeps = require('./osdeps/general');
            }
        }

        return this._osdeps;
    }
};
