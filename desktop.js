/**
 * Created by kevin on 8/6/15.
 */
'use strict';

// dependencies
var app = require('app');
var BrowserWindow = require('browser-window');
var Lang = require('./js/main/locales/zh-cn');
var interops = require('./js/desktop/interops');
var path = require('path');

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
    interops.init(app, mainWindow, __dirname);
});

// private functions


function _initMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        "width": 1000,
        "height": 725,
        "resizable": false,
        "overlay-scrollbars": true,
        "title": Lang.name,
        "icon": path.join(__dirname, "images/logo144.png")
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
