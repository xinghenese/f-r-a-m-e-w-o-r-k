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
    componentDidMount: function() {
        traverse(this._domTree.root, this.ssRoot);
    },
    render: function() {
        this.ssRoot = <div>{this.props.children}</div>;
        return this.ssRoot;
    }
});

//module initialization


//private functions
function reconstructElement(rootElement, domTree) {
    var rootNode;

    return React.cloneElement(rootElement, domTree['SideList']);

//    return _.reduce(root, function(memo, value, key) {
//        return React.cloneElement(memo, null, )
//    }, rootNode);
}

//cache the element in root {module.exports._domTree.root}.
function cacheElement(root, element, parent) {
    var path = paths.parsePath(element.props.domPath || './');
    var dir = path.relativeDirectory === paths.CWD && element.props.dir || [];
    var depths = dir.length - path.upwardLevels;
    var elementName = helper.getNodeName(element);

    console.log('dir: ', dir);
    console.log('depth: ', depth);
    console.log('elementName: ', elementName);

    console.log('root-before: ', root);

    if (depths < 0) {
        //no insertion;
    } else if (depths == 0) {
        //simple append the element to the root of the 'domTree'
//        attachElement(root, element, elementName);
        root[elementName] = element;
    } else {
        _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node, nodeName) {
//                if (!node) {
//                    return cwd;
//                }
//                return attachElement(cwd, node);
                if (!_.has(cwd, nodeName)) {
                    _.set(cwd, nodeName, node);
                } else {
                    var elements = _.get(cwd, nodeName);
                    var elementsArray = _.isArray(elements) ? elements : [elements];
                    elementsArray.push(node);
                }
            }, root);
    }

    console.log('root-after: ', root);
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


function traverseDomTree(reactTreeNode, domTreeNode) {
    return React.cloneElement(
        reactTreeNode,
        null,
        _.map(domTreeNode, function(value, key) {
            if (key === 'ReactElement') {
                return value;
            }
            return traverseDomTree(React.createElement(key), value);
        })
    );
}


function traverse(root, element) {
    cacheElement(root, element);

    React.Children.forEach(element.props.children, function(child) {
       traverse(root, child);
    });
}