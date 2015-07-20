/**
 * Created by Reco on 2015/7/12.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields


//core module to export
module.exports = {
    getNodeName: getNodeName,
    travserSubNodes: traverseSubNodes,
    removeSubNodes: function(element, removeFunc, thisArg) {
        return traverseSubNodes(element, void 0, function(){return true;}, removeFunc, thisArg);
    },
    processSubNodes: function(element, processFunc, filterFunc, thisArg) {
        return traverseSubNodes(element, processFunc, filterFunc, void 0, thisArg);
    },
    processAllSubNodes: function(element, processFunc, thisArg) {
        return traverseSubNodes(element, processFunc, void 0, void 0, thisArg);
    }
};

//module initialization


//private functions
function traverseSubNodes(element, processFunc, filterFunc, removeFunc, thisArg) {
    if (!_.isFunction(processFunc)
        && !_.isFunction(filterFunc)
        && !_.isFunction(removeFunc)) {
        return element;
    }

    return traverse(element, processFunc, filterFunc, removeFunc, thisArg);

}


function traverse(element, process, filter, remove, thisArg, level) {
    level = level || [];

//    console.group(getNodeName(element));
//    console.log(element);

    if (!element.props || !element.props.children) {
//        console.groupEnd();
        return void 0;
    }

    //if children are not objects, such as text nodes, return them as early
    //as possible, 'cause unnecessary to do the following transverse step,
    //which would probably lead to errors either.
    if (!_.isObject(element.props.children)) {
//        console.groupEnd();
        return element.props.children;
    }

    var children = React.Children.map(element.props.children, function(child, key) {
       if (_.isFunction(remove) && remove.call(thisArg, child, element)) {
            return void 0;
        }

        if (_.isFunction(filter) && !filter.call(thisArg, child, element)) {
//            console.log('child: ', child);
            return child;
        }

        var currentLevel = _(level).slice(0).push(key).value();
        var newChildProps = process.call(thisArg, child, currentLevel, element);
        var newChild = newChildProps ? React.cloneElement(child, newChildProps) : child;

        return React.cloneElement(
            newChild,
            null,
            traverse(newChild, process, filter, remove, thisArg, currentLevel)
        )
    }, thisArg || element);

//    console.groupEnd();
    return children;
}

function getNodeName(element) {
    if (!element) {
        return 'null';
    }
    if (React.isValidElement(element)) {
        return element.type.displayName || element.type;
    }
    return element.constructor.displayName || element.tagName || 'component';
}