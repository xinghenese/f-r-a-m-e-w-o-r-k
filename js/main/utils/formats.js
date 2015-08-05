/**
 * Created by kevin on 7/22/15.
 */
'use strict';

// exports
module.exports = {
    formatTime: function (milliseconds) {
        return new Date(milliseconds).toLocaleTimeString();
    }
};
