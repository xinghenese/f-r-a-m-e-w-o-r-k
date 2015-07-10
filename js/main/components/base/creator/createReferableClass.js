/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var React = require('react');
var referable = require('./../specs/referable');
var createGenerator = require('./createReactClassGenerator');

//private fields

//core module to export
module.exports = createGenerator({
    mixins: [referable],
    handleConflict: function(key, value, specValue) {
        if (key === 'render') {
            return function() {
                if (!_.isFunction(value) || !_.isFunction(specValue)) {
                    return null;
                }

                var element = specValue.call(this);

                if (!React.isValidElement(element)) {
                    return null;
                }
                return value.call(this. element);
            };
        }
    }
});

//module initialization


//private functions