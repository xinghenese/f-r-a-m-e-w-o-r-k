/**
 * Created by Administrator on 2015/8/20.
 */
'use strict';

// dependencies
var _  =require('lodash');
var origin = require('../net/base/origin');
var KeyInfo = require('./keyinfo');

// private fields


// exports
module.exports = origin.extend({
    keyMap: {},
    init: function (data) {
        var keyMap = this.keyMap = _.toPlainObject(this.keyMap);
        this._data = data;

        if (_.isEmpty(keyMap) || _.isEmpty(data)) {
            return;
        }

        _.forEach(keyMap, function(sourceKeyInfo, targetKey) {
            if (sourceKeyInfo instanceof KeyInfo) {
                var fieldType = sourceKeyInfo.fieldType;
                var sourceFieldName = sourceKeyInfo.fieldName;
                var defaultValue = sourceKeyInfo.defaultValue;
                var sourceValue = _.isFunction(sourceFieldName) ? sourceFieldName(data) : _.get(data, sourceFieldName);

                sourceValue = _.isUndefined(sourceValue) || _.isNaN(sourceValue) ? defaultValue : sourceValue;
                this[targetKey] = _.isFunction(fieldType) ? fieldType(sourceValue) : sourceValue;
            } else {
                this[targetKey] = _.get(data, sourceKeyInfo);
            }
        }, this);
    },
    extend: function (adapteds, finals) {
        var subType = origin.extend.call(this, adapteds, finals);
        if (subType.hasOwnProperty('keyMap')) {
            // inherit and merge keyMap
            subType.keyMap = _.assign({}, this.keyMap, subType.keyMap);
        }
        return subType;
    }
});

// module initialization


// private functions
