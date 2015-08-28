/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields


//core module to export
var InputBox = React.createClass({
    render: function () {
        //var { defaultValue, initialValue, ...others } = this.props;
        var defaultValue = this.props.defaultValue;
        var initialValue = this.props.initialValue;
        var others = _.omit(this.props, ['defaultValue', 'initialValue']);
        return (
            <input
                placeholder={defaultValue}
                value={initialValue}
                {...others}
                />
        )
    }
});

module.exports = InputBox;

//module initialization
