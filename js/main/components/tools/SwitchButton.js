/**
 * Created by Administrator on 2015/7/28.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../style/styles').makeStyle;
var defaultStyle = require('../../style/default');

//private fields
var buttonState = ['off', 'on'];

//core module to export
var SwitchButton = React.createClass({
    propTypes: {
        onSwitch: React.PropTypes.func
    },
    getInitialState: function() {
        return {on: !!this.props.initState};
    },
    _switch: function() {
        var newState = !this.state.on;
        this.setState({on: newState});
        if (_.isFunction(this.props.onSwitch)) {
            this.props.onSwitch(newState);
        }
    },
    render: function() {
        var style = defaultStyle.switchButton;
        var state = buttonState[+ this.state.on];

        return (
            <div
                className={this.props.className}
                style={makeStyle(style, style[state], this.props.style)}
                onClick={this._switch}
            >
                <div style={makeStyle(style.bullet, style.bullet[state])} />
            </div>
        )
    }
});

module.exports = SwitchButton;

//module initialization


//private functions
