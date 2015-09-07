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
                var sourceValue;

                if (_.isFunction(sourceFieldName)) {
                    // resolve KeyInfo.compose
                    sourceValue = sourceFieldName(data);
                } else if (_.isArray(sourceFieldName)) {
                    // resolve evaluation with a candidate list
                    _.forEach(sourceFieldName, function (field) {
                        if (_.has(data, field)) {
                            sourceValue = _.get(data, field);
                            return false;
                        }
                    })
                } else {
                    // resolve simple evaluation: data[sourceFieldName]
                    sourceValue = _.get(data, sourceFieldName);
                }
                sourceValue = _.isUndefined(sourceValue) || _.isNaN(sourceValue) ? defaultValue : sourceValue;

                if (!fieldType) {
                    this[targetKey] = sourceValue;
                } else if (_.isFunction(fieldType.create)) {
                    this[targetKey] = fieldType.create(sourceValue);
                } else if (_.isFunction(fieldType)) {
                    if (fieldType === Date) {
                        sourceValue = parseInt(sourceValue);
                        this[targetKey] = sourceValue ? new Date(sourceValue) : new Date();
                    } else {
                        this[targetKey] = fieldType(sourceValue);
                    }
                }
            } else {
                this[targetKey] = data[sourceKeyInfo];
            }
        }, this);
    },
    extend: function (adapteds, finals) {
        var subType = origin.extend.call(this, adapteds, finals);
        if (subType.hasOwnProperty('keyMap')) {
            subType.keyMap = _.assign({}, this.keyMap, subType.keyMap);
        }
        return subType;
    }
});

// module initialization


// private functions
