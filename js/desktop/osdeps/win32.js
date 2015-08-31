/**
 * Created by kevin on 8/31/15.
 */
'use strict';

// dependencies
var _ = require('lodash');
var Lang = require('../../main/locales/zh-cn');
var general = require('./general');
var strings = require('../../main/utils/strings');

// private fields
var BADGE_ICON_PREFIX = "images/badge-";
var BADGE_ICON_MORE_POSTFIX = "more";

// exports
module.exports = _.assign(general, {
    setBadge: function(app, mainWindow, badge) {
        var postfix = parseInt(badge) > 9 ? BADGE_ICON_MORE_POSTFIX : badge;
        var image = strings.format("{0}{1}.png", [BADGE_ICON_PREFIX, postfix]);
        var tooltip = strings.format(Lang.youHaveNewMessages, [badge]);

        if (mainWindow) {
            mainWindow.setOverlayIcon(image, tooltip);
        }

        if (badge && mainWindow && mainWindow.flashFrame) {
            mainWindow.flashFrame(true);
        }
    }
});

// module initialization


// private functions