/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var React = require('react');
var mixinSpecs = require('./mixinSpecs');
var traverse = require('./traverseSubNodes');
var modify = require('./modifySubNodes');

//private fields


//core module to export
module.exports = {
    mixinSpecs: mixinSpecs,

    traverseSubNodes: traverse.travserSubNodes,
    removeSubNodes: traverse.removeSubNodes,
    processSubNodes: traverse.processSubNodes,
    processAllSubNodes: traverse.processAllSubNodes,

    modifyOwnedTopNode: modify.modifyOwnedTopNode,
    modifyOwnedNodes: modify.modifyOwnedNodes,
    modifyDescendants: modify.modifyDescendants,

    getNodeName: traverse.getNodeName
};

//module initialization


//private functions