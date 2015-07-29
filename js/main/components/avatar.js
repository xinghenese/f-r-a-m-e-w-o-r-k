/**
 * Created by Administrator on 2015/7/23.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var commonStyle = require('../style/common');
var defaultStyle = require('../style/default');
var makeStyle = require('../style/styles').makeStyle;

//private fields
var avatarColors = {};
var defaultColor = "#499dd9";

//core module to export
var Avatar = React.createClass({
    render: function() {
        var name = this.props.name && this.props.name[0] || '';
        var img = name;

        if (this.props.src) {
            img = <img
                alt={name}
                src={this.props.src}
                width="100%"
                height="100%"
            />;
        }

        return (
            <a
                title={this.props.name}
                className={this.props.className}
                style={makeStyle(
                    commonStyle.avatar,
                    defaultStyle.avatar,
                    this.props.style,
                    {backgroundColor: getColor(this.props.index)}
                )}
            >
                {img}
            </a>
        )
    }
});

module.exports = Avatar;

//module initialization


//private functions
function getColor(id) {
    if (!id) {
        return defaultColor;
    }
    if (!_.has(avatarColors, id)) {
        _.set(avatarColors, id, generateRandomColor());
    }
    return _.get(avatarColors, id)
}

function generateRandomColor() {
    return '#' + _.padLeft((~~(Math.random() * 0x1000000)).toString(16), 6, '0');
}