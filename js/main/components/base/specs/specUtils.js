/**
 * Created by Reco on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var composite = require('../../../net/base/composite');

//private fields

//core module to export
var FUNCTION_TYPE = 'function';
var EMPTY_FUNCTION = function(){};
var DEFAULT_DISPLAY_NAME = 'Component';

var BASE = {
    displayName: DEFAULT_DISPLAY_NAME
};

var utils = {
    mixinSpecs: mixinSpecs
};

module.exports = utils;

//module initialization


//private functions
function mixinSpecs(configs) {
    return cleanSpecs(composite.create(configs) || configs);
}

function cleanSpecs(spec) {
    return _.reduce(
        _.omit(spec)
        , function(memo, value, key) {
            if (isSet(value)) {
                return _.set(memo, key, value);
            }
            return memo;
        }
        , {}
    );
}

function isSet(value) {
    if (!value) {
        return false;
    }
    if (_.isFunction(value)) {
        return true;
    }
    return !_.isEmpty(value);
}