/**
 * Created by kevin on 8/14/15.
 */
'use strict';

// dependencies
var _ = require('lodash');

// private fields
var ArgRegex = new RegExp("{-?[0-9]+}", "g");

// exports
module.exports = {
    format: function(str, args) {
        return str.replace(ArgRegex, function(item) {
            var intVal = parseInt(item.substring(1, item.length - 1));
            var replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = "{";
            } else if (intVal === -2) {
                replace = "}";
            } else {
                replace = "";
            }
            return replace;
        });
    },
    join: function(strArr, separator) {
        var result = "";
        var first = true;
        if (strArr && _.isArray(strArr)) {
            _.forEach(strArr, function(str) {
                if (first) {
                    first = false;
                } else {
                    result = result.concat(separator);
                }
                result = result.concat(str);
            });
        }
        return result;
    },
    template: function(tpl) {
        var index = 1,
            items = arguments;
        return (tpl || '').replace(/{(\w*)}/g, function(match, p1) {
            var item = items[index++];
            if (_.isArray(item)) {
                item = item.join();
            }
            return item  || p1 || match;
        });
    }
};
