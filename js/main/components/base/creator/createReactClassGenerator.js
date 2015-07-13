/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var mixinSpecs = require('./../helper/helper').mixinSpecs;

//private fields

//core module to export
module.exports = function(configs) {
    return function(spec) {
        if (configs && configs.mixins && configs.mixins.push) {
            spec = _.assign({}, configs, {
              //have a copy of mixins to make configs immutable.
              mixins: _(configs.mixins).slice(0).push(spec).value()
            });
        }
        return React.createClass(mixinSpecs(spec));
    }
};

//module initialization


//private functions