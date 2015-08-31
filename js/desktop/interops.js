/**
 * Created by kevin on 8/28/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var EventTypes = require('../main/constants/eventtypes');
var OsQueryConstants = require('../main/constants/osqueryconstants');
var desktopConfig = require('./desktopconfig');
var ipc = require('ipc');
var systems = require('./systems');

// exports
module.exports = {
    _app: null,
    _mainWindow: null,
    _dir: null,
    init: function(app, mainWindow, dir) {
        this._app = app;
        this._mainWindow = mainWindow;
        this._dir = dir;
        _initDockNotificationHandlers(this._app, this._mainWindow, this._dir);
        _initOsRelatedQueries(this._app);
    }
};

// private functions
function _getDevice() {
    if (/^win/.test(process.platform)) {
        return "Windows";
    } else if (/^darwin/.test(process.platform)) {
        return "Mac";
    } else if (/^linux/.test(process.platform)) {
        return "Linux";
    } else {
        return process.platform;
    }
}

function _initDockNotificationHandlers(app, mainWindow, dir) {
    ipc.on(EventTypes.UPDATE_DOCK_BADGE, function(event, badge) {
        systems.setBadge(app, mainWindow, dir, badge);
    });
}

function _initOsRelatedQueries() {
    ipc.on(EventTypes.OS_QUERY, function(event, type) {
        switch (type) {
            case OsQueryConstants.OS:
                event.returnValue = _getDevice();
                break;
            case OsQueryConstants.DEVICE:
                event.returnValue = desktopConfig.device;
                break;
            default:
                event.returnValue = "Unknown";
                break;
        }
    });
}
