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
        console.log('stylizable#className: ', child.props.className);

        var style = child.props.style;
        console.log('style: ', style);
        if (!style || _.isEmpty(style)) {
            return;
        }
        if (_.isArray(style)) {
            return {style: makeStyle.apply(null, style)};
        }
        return {style: makeStyle(style)}
    }
};

//module initialization


//private functions
