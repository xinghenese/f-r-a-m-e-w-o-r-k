/**
 * Created by Administrator on 2015/7/14.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../base/helper');
var paths = require('../../utils/paths');
var emitter = require('../../utils/eventemitter');

//private fields


//core module to export
module.exports = React.createClass({
    _emitter: emitter.create(),
    _domTree: {root: {}},
    render: function() {
        helper.traverseSubNodes()
    }
});

//module initialization


//private functions
function reconstructElement(root) {
    var rootNode;

//    return _.reduce(root, function(memo, value, key) {
//        return React.cloneElement(memo, null, )
//    }, rootNode);
}

//cache the element in root {module.exports._domTree.root}.
function cacheElement(root, element, parent) {
    var path = paths.parsePath(element.props.domPath || './');
    var dir = path.relativeDirectory === paths.ROOT ? [] : element.props.dir;
    var depths = dir.length - path.upwardLevels;
    var elementName = helper.getNodeName(element);

    if (depths < 0) {
        //no insertion;
    } else if (depths == 0) {
        //simple append the element to the root of the 'domTree'
        attachElement(root, element, elementName);
    } else {
        var newDir = _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                if (!node) {
                    return cwd;
                }
                return attachElement(cwd, node);
            }, dir);
    }

}

function attachElement(cwd, element, name) {
    name = name || helper.getNodeName(element);

    if (React.isValidElement(cwd)) {
        return React.cloneElement(
            cwd,
            null,
            cwd.props.children,
            element
        )
    }
    if (!_.has(cwd, name)) {
        return _.set(cwd, name, element);
    }
    var elements = _.get(cwd, name);
    var elementsArray = _.isArray(elements) ? elements : [elements];
    elementsArray.push(element);
    return _.set(cwd, name, elementsArray);
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

        return React.cloneElement(
            child,
            process.call(thisArg, child, currentLevel, element),
            traverse(child, process, filter, remove, thisArg, currentLevel)
        )
    }, thisArg || element);

//    console.groupEnd();
    return children;
}