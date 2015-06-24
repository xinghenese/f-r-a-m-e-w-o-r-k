/**
 * Created by kevin on 6/16/15.
 */
'use strict';

module.exports = {
    containsValuedProp: function(obj, prop) {
        return obj[prop] ? true : false;
    },
    copyValuedProp: function(src, srcAttr, dst, dstAttr) {
        if (containsValuedProp(src, srcAttr)) {
            dst[dstAttr] = src[srcAttr];
        }
    },
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
