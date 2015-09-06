/**
 * Created by kevin on 8/31/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Lang = require('../../main/locales/zh-cn');
var general = require('./general');
var path = require('path');
var strings = require('../../main/utils/strings');

// private fields
var BADGE_ICON_PATH = "images";
var BADGE_ICON_PREFIX = "badge-";
var BADGE_ICON_MORE_POSTFIX = "more";

// exports
module.exports = _.create(general, {
    setBadge: function(app, mainWindow, dir, badge) {
        if (!mainWindow) {
            return;
        }

        if (!badge) {
            mainWindow.setOverlayIcon(null, Lang.name);
            return;
        }

        var postfix = parseInt(badge) > 9 ? BADGE_ICON_MORE_POSTFIX : badge;
        var image = strings.format("{0}{1}.png", BADGE_ICON_PREFIX, postfix);
        var imagePath = path.join(dir, BADGE_ICON_PATH, image);
        var tooltip = strings.format(Lang.youHaveNewMessages, badge);

        mainWindow.setOverlayIcon(imagePath, tooltip);

        if (!mainWindow.isFocused()) {
            mainWindow.flashFrame(true);
        }
    }
});
