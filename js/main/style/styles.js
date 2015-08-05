/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields
var MIXIN_FIELD = '@mixin';

//core module to export
module.exports = {
    makeStyle: makeStyle,
    setStyle: setStyle
};

//private functions
function makeStyle() {
    return _.reduce(_.toArray(arguments), function (result, arg) {
        return _.assign(result, mixinStyle(arg));
    }, {});
}

function mixinStyle(style) {
    style = _.toPlainObject(style);

    if (_.isEmpty(style)) {
        return style;
    }
    return _.reduce(style, function (memo, value, key) {
        if (!_.isObject(value) && !_.isFunction(value)) {
            return _.set(memo, key, value + "");
        } else if (_.isObject(value) && key === MIXIN_FIELD) {
            return _.assign(memo, mixinStyle(value));
        }
        return memo;
    }, {})
}

//targetStyle: element | element.style
function setStyle(targetStyle, sourceStyle) {
    targetStyle = _.isObject(targetStyle.style) ? targetStyle.style : targetStyle;
    _.assign(targetStyle, makeStyle(sourceStyle));
}

function coverStyle(component, style) {
    if (!_.isPlainObject(style)
        || !component
        || !component.props
        || !component.props.children) {
        return;
    }
    React.Children.forEach(component.props.children, function (child) {
        var className = child.props.className;

    });
}
