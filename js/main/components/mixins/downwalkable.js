/**
 * Created by Administrator on 2015/7/8.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields


//core module to export
module.exports = {
    componentWillMount: function() {
        this.props.children = React.Children.map(this.props.children, function(child, key) {
          return React.cloneElement(child, {
            ref: (this._seq || 'child-') + key
          });
        }, this);
    },
    walkRefs: function(callback, isdeep, walkResult) {
        return _.reduce(this.refs, function(memo, element) {
            if (isdeep && !_.isEmpty(element.refs)) {
                memo = this.walkRefs(callback, isdeep, memo);
            }
            return callback(memo, element);
        }, walkResult, this);
    }
};

//module initialization


//private functions
