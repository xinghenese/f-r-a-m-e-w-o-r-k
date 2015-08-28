/**
 * Created by Administrator on 2015/7/28.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var makeStyle = require('../../style/styles').makeStyle;
var defaultStyle = require('../../style/default');

//private fields


//core module to export
var SwitchButton = React.createClass({
    propTypes: {
        onSwitch: React.PropTypes.func
    },
    getInitialState: function () {
        return {on: !!this.props.initState};
    },
    _switch: function () {
        var newState = !this.state.on;
        this.setState({on: newState});
        if (_.isFunction(this.props.onSwitch)) {
            this.props.onSwitch(newState);
        }
    },
    render: function () {
        return (
            <label onClick={this._switch} {..._.omit(this.props, ['onClick'])}>
                <button className={classNames('toggle', {active: this.state.on})}/>
            </label>
        )
    }
});

module.exports = SwitchButton;

//module initialization


//private functions
