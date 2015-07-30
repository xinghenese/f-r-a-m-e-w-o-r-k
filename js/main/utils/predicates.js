/**
 * Created by kevin on 7/16/15.
 */
'use strict';

// exports
module.exports = {
    uuidPredicate: function (uuid) {
        return function (data) {
            return data["uuid"] === uuid;
        };
    }
};
