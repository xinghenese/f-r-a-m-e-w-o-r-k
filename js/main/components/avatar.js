/**
 * Created by Administrator on 2015/7/23.
 */
'use strict';

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var commonStyle = require('../style/common');
var defaultStyle = require('../style/default');
var makeStyle = require('../style/styles').makeStyle;
var Image = require('./tools/IntelImage');

//private fields
var avatarColors = {};
var colors = ['blue', 'cyan-blue', 'green', 'orange', 'purple', 'red', 'yellow'];

//core module to export
var Avatar = React.createClass({
    render: function () {
        var name = String(this.props.name && this.props.name[0] || '').toUpperCase();
        var img = name;

        if (this.props.src) {
            img = <Image alt={name} src={this.props.src}
                replacedElementOnError={function() {return <span>{name}</span>}} />;
        }

        return <a title={this.props.name} className={classNames('avatar', this.props.className, getColor(this.props.index))} {..._.omit(this.props, ['className'])}>{img}</a>;
    }
});

module.exports = Avatar;

//module initialization


//private functions
function getColor(id) {
    if (!id) {
        return colors[0];
    }
    if (!_.has(avatarColors, id)) {
        _.set(avatarColors, id, generateRandomColor());
    }
    return _.get(avatarColors, id);
}

function generateRandomColor() {
    return colors[~~(Math.random() * 8)];
}
