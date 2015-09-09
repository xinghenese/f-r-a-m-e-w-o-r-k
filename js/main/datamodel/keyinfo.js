/**
 * Created by Administrator on 2015/8/20.
 */
'use strict';

// dependencies
var _ = require('lodash');

// private fields


// exports
var KeyInfo = module.exports = function (fieldName, fieldType, defaultValue) {
    if (!this instanceof KeyInfo) {
        return new KeyInfo(fieldName, fieldType, defaultValue);
    }

    this.fieldName = _.isFunction(fieldName) ? fieldName
        : _.isArray(fieldName) ? KeyInfo.get(fieldName)
        : _.property(fieldName);

    this.fieldType = KeyInfo.makeFieldType(fieldType);
    this.defaultValue = defaultValue;

    if (!_.isUndefined(defaultValue)) {
        return;
    }

    switch (fieldType) {
        case Number:    this.defaultValue = KeyInfo.NUMBER_NOT_SET; return;
        case String:    this.defaultValue = KeyInfo.STRING_NOT_SET; return;
        case Boolean:   this.defaultValue = KeyInfo.BOOLEAN_NOT_SET; return;
        case Object:    this.defaultValue = KeyInfo.OBJECT_NOT_SET; return;
        case Array:     this.defaultValue = KeyInfo.ARRAY_NOT_SET; return;
    }
};

// module initialization
KeyInfo.BOOLEAN_NOT_SET = false;
KeyInfo.NUMBER_NOT_SET = -1;
KeyInfo.STRING_NOT_SET = '';
KeyInfo.OBJECT_NOT_SET = {};
KeyInfo.ARRAY_NOT_SET = [];
KeyInfo.NUMBER_ZERO = 0;
KeyInfo.NUMBER_NEG_ONE = -1;

KeyInfo.create = function (fieldName, fieldType, defaultValue) {
    return new KeyInfo(fieldName, fieldType, defaultValue);
};

// resolve evaluation with a candidate list
KeyInfo.get = function (candidates) {
    return function (data) {
        var result = _.get(data, candidates);
        if (_.isArray(candidates) && !_.isEmpty(candidates)) {
            _.forEach(candidates, function (candidate) {
                if (_.has(data, candidate)) {
                    result = _.get(data, candidate);
                    return false;
                }
            })
        }
        return result;
    };
};

KeyInfo.makeFieldType = function (fieldType) {
    return _.isFunction(fieldType.create) ? _.bind(fieldType.create, fieldType)
        : _.isFunction(fieldType) ? (fieldType === Date ? createDate : fieldType)
        : getSelf;
};

KeyInfo.arrayOf = function (type) {
    return function (data) {
        return _.map(data, KeyInfo.compose(type));
    }
};

KeyInfo.compose = function (composedInfo) {
    if (_.isArray(composedInfo)) {
        return function (data) {
            return _.map(composedInfo, function (value) {
                // resolve nested KeyInfo.compose
                if (_.isFunction(value)) {
                    return value(data);
                }
                if (_.isArray(value)) {
                    return KeyInfo.get(value)(data);
                }
                return data[value];
            })
        }
    }
    if (_.isObject(composedInfo)) {
        return function (data) {
            return _.mapValues(composedInfo, function (value) {
                // resolve nested KeyInfo.compose
                if (_.isFunction(value)) {
                    return value(data);
                }
                if (_.isArray(value)) {
                    return KeyInfo.get(value)(data);
                }
                return data[value];
            })
        }
    }
    if (_.isFunction(composedInfo)) {
        return composedInfo;
    }
    return _.property(composedInfo);
};

function getSelf(value) {
    return value;
}

function createInteger(num, radix) {
    return parseInt(num, radix || 10);
}

function createDate(date) {
    date = parseInt(date, 10);
    return date ? new Date(date) : new Date();
}
