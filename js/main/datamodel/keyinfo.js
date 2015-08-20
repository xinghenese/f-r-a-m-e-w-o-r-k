/**
 * Created by Administrator on 2015/8/20.
 */
'use strict';

// dependencies


// private fields


// exports
var KeyInfo = module.exports = function (fieldName, defaultValue) {
    if (!this instanceof KeyInfo) {
        return new KeyInfo(fieldName, defaultValue);
    }
    this.fieldName = fieldName;
    this.defaultValue = defaultValue;
};

// module initialization
KeyInfo.NUMBER_NOT_SET =    -1;
KeyInfo.STRING_NOT_SET =    '';
KeyInfo.NUMBER_ZERO = 0;
KeyInfo.NUMBER_NEG_ONE = -1;

// private functions
