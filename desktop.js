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
});

// private functions
function _initDockNotificationHandlers() {
    ipc.on(EventTypes.UPDATE_DOCK_BADGE, function(event, badge) {
        app.dock.setBadge(badge);
        app.dock.bounce();
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
