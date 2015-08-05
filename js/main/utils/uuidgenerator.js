/**
 * Created by kevin on 7/15/15.
 */
'use strict';

// exports
var UuidGenerator = {
    generate: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

module.exports = UuidGenerator;
