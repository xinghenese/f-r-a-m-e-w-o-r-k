/**
 * Created by Administrator on 2015/7/2.
 */

//dependencies
var React = require('react');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');
var defaultStyle = require('../../style/default');

//private fields


//core module to export
var Mask = React.createClass({
    render: function () {
        return <div className="mask" style={makeStyle(commonStyle.mask, defaultStyle.mask, this.props.style)}></div>
    }
});

module.exports = Mask;

//module initialization


//private functions
