/**
 * Created by Administrator on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../base/helper/helper');

//private fields


//core module to export
var DataHolder =React.createClass({
    displayName: 'DataHolder',
    componentWillMount: function() {
        _.isFunction(this._addInternalListener) && this._addInternalListener();
    },
    render: function() {
        if (!this.props.handler) {
            return null;
        }
        return React.createElement(this.props.handler, this.props);
    }
});

//module initialization


//private functions
