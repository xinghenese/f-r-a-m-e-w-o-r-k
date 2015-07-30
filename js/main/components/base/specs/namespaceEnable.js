/**
 * Created by Administrator on 2015/7/20.
 */

//dependencies
var _ = require('lodash');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
module.exports = {
    descendantsProps: function (child, level, parent) {
        if (!this.props.namespace || !child.props.className) {
            return;
        }

        var props = {};
        var className = child.props.className;
        var parentStyle = parent.props.rawStyle || parent.props.style;
        var rootStyle = this.props.rawStyle || this.props.style;
        var inheritedStyle = parentStyle && !_.isEmpty(parentStyle) ? parentStyle : rootStyle;
        var camelClassName = _.camelCase(className);

        console.log('inheritedStyle: ', inheritedStyle);
        console.log('camelClassName: ', camelClassName);

        if (_.has(inheritedStyle, camelClassName)) {
            var rawStyle = _.get(inheritedStyle, camelClassName);
            console.log('style: ', rawStyle);
            _.assign(props, {
                rawStyle: rawStyle,
                style: rawStyle
            });
        }
        _.set(props, 'className', this.props.namespace + '-' + className);

        return props;
    }
};

//module initialization


//private functions
