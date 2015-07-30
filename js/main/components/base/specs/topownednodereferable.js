/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var React = require('react');

//private fields


//core module to export
module.exports = {
    displayName: 'TopOwnedNodeReferable',
    getTopOwnedNode: function () {
        if (!this.isMounted()) {
            throw new Error('the component ' + this.displayName + ' is not mounted yet.'
                + ' No owned nodes can be accessed.');
        }
        return this.refs[this.getSeq() || 'top-owned-node'];
    },
    topOwnedNodeProps: function () {
        return {ref: this.getSeq() || 'top-owned-node'};
    }
};

//module initialization


//private functions
