/**
 * Created by Administrator on 2015/7/29.
 */
'use strict';

//dependencies
var React = require('react');
var makeStyle = require('../../style/styles').makeStyle;
var commonStyle = require('../../style/common');

//private fields
var SETTINGS = 'Settings';
var iconPath = '/images/settings.png';

//core module to export
var Settings = React.createClass({
    propTypes: {
        onSettings: React.PropTypes.func
    },
    render: function () {
        var icon = (
            <img
                alt={SETTINGS}
                src={this.props.icon || iconPath}
                width="100%"
                height="100%"
                />
        );

        return (
            <a
                title={SETTINGS}
                className={this.props.className}
                onClick={this.props.onSettings}
                style={makeStyle(
                    commonStyle.settings,
                    this.props.style
                )}
                >
                {icon}
            </a>
        )
    }
});

module.exports = Settings;

//module initialization


//private functions
