/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../helper/helper');

//private fields


//core module to export
module.exports = helper.modifyDescendants({
    displayName: 'DescendantsWalkable',
    modifyDescendants: function(child, path) {
        return {
            ref: (this._seq || '') + 'child-' + path.join('-')
        }
    },
    walkDescendants: function(process, result) {
        return _.reduce(this.refs, function(memo, element) {
            return process.call(this, element, memo);
        }, result, this);
    },
    componentDidMount: function() {
        _.forOwn(this.refs, function(element, key) {
            console.group(key + ': ' + helper.getNodeName(element));
            console.log(element);
            console.groupEnd();

        });

        var element = this.refs[this._seq];
        console.group(this._seq + ': ' + helper.getNodeName(element));
        console.log(element);
        console.groupEnd();

    }
});

//module initialization


//private functions