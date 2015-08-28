/**
 * Created by Reco on 2015/6/30.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var Submit = React.createClass({
    render: function () {
        var others = _.omit(this.props, ['name', 'value']);
        return (
            <button type="submit" {...others}>{this.props.name || this.props.value}</button>
        );
    }
});

module.exports = Submit;

//module initialization


//private functions
