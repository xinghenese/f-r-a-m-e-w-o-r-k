/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var composite = require('../../../net/base/composite');
var referable = require('./../specs/referable');
var validatable = require('./../specs/validatable');
var createGenerator = require('./createReactClassGenerator');

//private fields


//core module to export
module.exports = createGenerator({
    mixins: [referable, validatable],
    handleConflict: function(key, value1, value2, specValue) {
        if (key === 'render') {
            return function() {
                if (!_.isFunction(value1) || !_.isFunction(value2)) {
                    return null;
                }

                var element = value2.call(this);

                if (!React.isValidElement(element)) {
                    return null;
                }
                return value1.call(this, element);
            }
        }
    }
});

//module initialization


//private functions
