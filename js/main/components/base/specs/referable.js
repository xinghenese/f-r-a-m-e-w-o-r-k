/**
 * Created by Reco on 2015/7/9.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields
var indexMap = {};
var REFERABLE_NAME = 'Referable';

//core module to export
module.exports = {
    displayName: REFERABLE_NAME,
    componentWillMount: function () {
        var className = this.constructor.displayName;
        var index = _.get(indexMap, className) || 0;

        _.set(indexMap, className, index + 1);
        this._seq = hyphenFormalize(className) + '-' + index + '-';
    },
    render: function (element) {
        if (!React.isValidElement(element)) {
            return null;
        }
        return React.cloneElement(element, {
            ref: this._seq
        }, element.props.children);
    }
};

//module initialization


//private functions
function hyphenFormalize(str) {
    return ('' + str).replace(/[A-Z]/g, function (match, offset) {
        return (offset ? '-' : '') + match.toLowerCase();
    })
}
