/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields


//core module to export
module.exports = {
    displayName: 'DownWalkable',
    walkRefs: function(callback, isdeep, walkResult) {
        return _.reduce(this.refs, function(memo, element) {
            if (isdeep && !_.isEmpty(element.refs)) {
                memo = this.walkRefs(callback, isdeep, memo);
            }
            return callback(memo, element);
        }, walkResult, this);
    },
    render: function(element) {
        var children = React.Children.map(element.props.children, function(child, key) {
            return React.cloneElement(child, {
                ref: (this._seq || 'child') + '-' + key
            });
        }, this);
        return React.cloneElement(element, void 0, children);
    }
};

//module initialization


//private functions
