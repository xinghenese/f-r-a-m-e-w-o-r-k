/**
 * Created by kevin on 8/6/15.
 */
'use strict';

// dependencies
var app = require('app');
var BrowserWindow = require('browser-window');
var Lang = require('./js/main/locales/zh-cn');
var globalShortcut = require('global-shortcut');
var interops = require('./js/desktop/interops');
var path = require('path');

var WIDTH = 1000;
var HEIGHT = 725;
var DEV_WIDTH = 2000;

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
    _registerShortcuts();
});

app.on('will-quit', function() {
    globalShortcut.unregisterAll();
});

// private functions
function _initMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        "width": WIDTH,
        "height": HEIGHT,
        "resizable": false,
        "overlay-scrollbars": true,
        "title": Lang.name,
        "icon": path.join(__dirname, "images/logo144.png")
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

function _registerShortcuts() {
    globalShortcut.register('ctrl+l', function() {
        if (mainWindow.isResizable()) {
            mainWindow.setSize(WIDTH, HEIGHT);
            mainWindow.setResizable(false);
            mainWindow.closeDevTools();
        } else {
            mainWindow.setSize(DEV_WIDTH, HEIGHT);
            mainWindow.setResizable(true);
            mainWindow.openDevTools();
        }
    });
}
