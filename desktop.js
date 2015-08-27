/**
 * Created by kevin on 8/6/15.
 */
'use strict';

// dependencies
var app = require('app');
var BrowserWindow = require('browser-window');
var EventTypes = require('./js/main/constants/eventtypes');
var globalEmitter = require('./js/main/events/globalemitter');
var ipc = require('ipc');
var systems = require('./js/desktop/systems');

require('crash-reporter').start();

// private fields
var mainWindow = null;
var appIcon = null;

// desktop logic
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    _initMainWindow();
    _initNotificationHandlers();
    _initOsRelatedQueries();
});

// private functions
function _initDockNotificationHandlers() {
    ipc.on(EventTypes.UPDATE_DOCK_BADGE, function(event, badge) {
        systems.setBadge(app, badge);
    });
}

function _initMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        "width": 1000,
        "height": 725,
        "max-width": 1000,
        "max-height": 725,
        "min-width": 1000,
        "min-height": 725
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Open the devtools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

function _initNotificationHandlers() {
    _initDockNotificationHandlers();
}

function _initOsRelatedQueries() {
    ipc.on(EventTypes.OS_QUERY, function(event, type) {
        switch (type) {
            case "os":
                event.returnValue = _getDevice();
                break;
            default:
                event.returnValue = "Unknown";
                break;
        }
    });
}

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
