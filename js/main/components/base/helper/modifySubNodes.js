/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var traverse = require('./traverseSubNodes');

//private fields


//core module to export
module.exports = {
    modifyOwnedTopNode: modifyOwnedTopNode,
    modifyOwnedNodes: modifyOwnedNodes,
    modifyDescendants: modifyDescendants
};

//module initialization


//private functions
function modifyOwnedTopNode(spec) {
    if (!spec || !_.isFunction(spec.modifyOwnedTopNode)) {
        return spec;
    }

    var modifyFunc = spec.modifyOwnedTopNode;

    _.set(spec, 'render', function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        return React.cloneElement(
           element,
           modifyFunc.call(this, element),
           element.props.children
        );
    });
    delete spec.modifyOwnedTopNode;

    return spec;
}

function modifyOwnedNodes(spec) {
    if (!spec || !_.isFunction(spec.modifyOwnedNodes)) {
        return spec;
    }

    var modifyFunc = spec.modifyOwnedNodes;

    _.set(spec, 'render', function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        var ownees = traverse.processSubNodes(
            element,
            modifyFunc,
            function(child, element) {
                if (!child.ref) return true;
            },
            this
        );

        return React.cloneElement(
            element,
            void 0,
            ownees
        );
    });
    delete spec.modifyOwnedNodes;

    return spec;
}

function modifyDescendants(spec) {
    if (!spec || !_.isFunction(spec.modifyDescendants)) {
        return spec;
    }

    var modifyFunc = spec.modifyDescendants;

    _.set(spec, 'render', function(element) {
        if (!React.isValidElement(element)) {
            return null;
        }

        var children = traverse.processAllSubNodes(
            this, modifyFunc, this
        );

        return React.cloneElement(
            element,
            void 0,
            children
        );
    });
    delete spec.modifyDescendants;

    return spec;
}