/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../helper/helper');

//core module to export
module.exports = {
    displayName: 'DescendantsWalkable',
    descendantsProps: function(child, path) {
//        if (child.ref) {
//            return null;
//        }
        return {
            ref: child.ref || ((this._seq || '') + 'child-' + path.join('-'))
        }
    },
    walkDescendants: function(process, result) {
        return _.reduce(this.refs, function(memo, element) {
            return process.call(this, element, memo);
        }, result, this);
    }
};
