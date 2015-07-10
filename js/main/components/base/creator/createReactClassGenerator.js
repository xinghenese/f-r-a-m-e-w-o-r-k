/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var specUtils = require('./../specs/specUtils');

//private fields

//core module to export
module.exports = function(configs) {
    return function(spec) {
        if (configs && configs.mixins && configs.mixins.push) {
            //have a copy of mixins to make configs immutable.
            var mixins = configs.mixins.slice(0);
            mixins.push(spec);
            spec = _.assign({}, configs, {mixins: mixins});
        }
        return React.createClass(specUtils.mixinSpecs(spec));
    }
};

//module initialization


//private functions