/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields
var indexMap = {};

//core module to export
module.exports = {
    displayName: 'Identifiable',
    componentWillMount: function() {
        var className = this.constructor.displayName;
        var index = _.get(indexMap, className) || 0;

        _.set(indexMap, className, index + 1);
        this._seq = this._seq || hyphenFormalize(className) + '-' + index + '-';
    },
    getSeq: function() {
        return createSeqIfNotExists(this);
    }
};

//module initialization


//private functions
function createSeqIfNotExists(component) {
    if (!component._seq) {
        var className = component.constructor.displayName;
        var index = _.get(indexMap, className) || 0;

        _.set(indexMap, className, index + 1);
        component._seq = hyphenFormalize(className) + '-' + index + '-';
    }
    return component._seq;
}

function hyphenFormalize(str) {
    return ('' + str).replace(/[A-Z]/g, function(match, offset) {
        return (offset ? '-' : '') + match.toLowerCase();
    })
}