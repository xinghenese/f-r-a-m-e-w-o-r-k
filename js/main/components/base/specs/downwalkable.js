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
//        var children = React.Children.map(element.props.children, function(child, key) {
//            return React.cloneElement(child, {
//                ref: (this._seq || 'child') + '-' + key
//            });
//        }, this);
        var children = markChildren(element, function(child, key) {
            return {className: (this._seq || 'child') + '-' + key};
        }, this);
        console.log('children: ', children);
        return React.cloneElement(element, void 0, children);
    }
};

//module initialization


//private functions
function markChildren(element, callback, root) {
    console.log('element: ', element);
    console.log('element.props: ', element.props);
    if (!element.props || !element.props.children) {
        return void 0;
    }
    return React.Children.map(element.props.children, function(child, key) {
        return React.cloneElement(
            child,
            callback.call(this, child, key),
            markChildren(child, callback, root)
        );
    }, root || element);
}