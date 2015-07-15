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
    console.group('cache');
    console.log('element.props.domPath: ', element.props.domPath);
    var path = paths.parsePath(element.props.domPath || './');
    var dir = (path.relativeDirectory === paths.CWD
        && element.props.dir
        || []
    ).concat(path.subPath);
    var depth = dir.length - path.upwardLevels;
    var elementName = helper.getNodeName(element);

    console.log('path: ', path);
    console.log('dir: ', dir);
    console.log('depth: ', depth);
    console.log('elementName: ', elementName);
    console.log('elementHandler: ', element.props.handler);

    console.log('root-before: ', _.assign({}, root));

    if (depth < 0) {
        //no insertion;
    } else if (depth == 0) {
        //simple append the element to the root of the 'domTree'
//        attachElement(root, element, elementName);
        if (!_.has(root, elementName)) {
            _.set(root, elementName, element);
        } else {
            var elements = _.get(root, elementName);
            if (!_.isArray(elements)) {
                elements = [elements];
                _.set(root, elementName, elements);
            }
            elements.push(element);
        }
    } else {
        console.log(_(dir)
            .dropRight(path.upwardLevels).value());

        var newDir = _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                console.log('cwd: ', cwd);
                console.log('node: ', node);
                if (!node || !_.has(cwd, node)) {
                    return cwd;
                }
//                return attachElement(cwd, node);
                _.set(cwd, node, {});


//                if (!_.has(cwd, nodeName)) {
//                    _.set(cwd, nodeName, node);
//                } else {
//                    var elements = _.get(root, elementName);
//                    if (!_.isArray(elements)) {
//                        elements = [elements];
//                        _.set(root, elementName, elements);
//                    }
//                    elements.push(element);
//                }
            }, root);

        console.log('newDir: ', _.assign({}, newDir));

        if (!_.has(newDir, elementName)) {
            _.set(newDir, elementName, element);
        } else {
            elements = _.get(newDir, elementName);
            if (!_.isArray(elements)) {
                elements = [elements];
                _.set(newDir, elementName, elements);
            }
            elements.push(element);
        }
    }

    console.log('root-after: ', _.assign({}, root));
    console.groupEnd();
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
//        var newChild = React.cloneElement(child, {});
       traverse(root, child);
    });
}