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
    this.fieldName = fieldName;
    this.fieldType = fieldType;
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

// private functions
