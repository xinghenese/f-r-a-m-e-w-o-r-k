/**
 * Created by kevin on 6/16/15.
 */
'use strict';

module.exports = {
    mergeObjects: function(obj1, obj2) {
        var result = {};
        for (var attr in obj1) {
            result[attr] = obj1[attr];
        }
        for (var attr in obj2) {
            result[attr] = obj2[attr];
        }
        return result;
    }
};
