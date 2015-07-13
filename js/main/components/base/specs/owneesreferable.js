/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../helper/helper');

//private fields


//core module to export
module.exports = helper.modifyOwnedNodes({
    displayName: 'OwneesReferable',
    modifyOwnedNodes: function(ownee, path, element) {
        return {
            ref: (this._seq || '') + 'owned-' + path.join('-')
        }
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
