/**
 * Created by Administrator on 2015/7/14.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var helper = require('../base/helper/helper');
var paths = require('../../utils/paths');
var emitter = require('../../utils/eventemitter');

//private fields


//core module to export
module.exports = React.createClass({
    _emitter: emitter.create(),
    _domTree: {},
    componentDidMount: function() {
        traverse(this._domTree, this.ssRoot);
        console.log('this._domTree: ', this._domTree);
        var root = reconstructElement(this._domTree);
        console.log('root: ', root);
        React.render(root, document.getElementById('content1'));
    },
    render: function() {
        this.ssRoot = <div>{this.props.children}</div>;
        return this.ssRoot;
    }
});

//module initialization


//private functions
function reconstructElement(domTree) {
    return traverseAndConstruct(domTree);
}

//cache the element in root {module.exports._domTree.root}.
function cacheElement(root, element, parent) {
    console.group('cache');
    console.log('element.props.domPath: ', element.props.domPath);
    var path = paths.parsePath(element.props.domPath || './');
    var dir = (path.relativeDirectory === paths.CWD
        && element.props.dir || []
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
    } else {
        console.log(_(dir)
            .dropRight(path.upwardLevels).value());

        var newDir = _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                if (!node) {
                    return cwd;
                }
                if (!_.has(cwd, node)) {
                    _.set(cwd, node, {});
                }
                return _.get(cwd, node);
            }, root);

        if (!_.has(newDir, elementName)) {
            _.set(newDir, elementName, element);
        } else {
            var elements = _.get(newDir, elementName);
            if (!_.isArray(elements)) {
                elements = [elements];
                _.set(newDir, elementName, elements);
            }
            elements.push(element);
        }
    }

    console.log('newDir: ', _.assign({}, newDir));

    console.log('root-after: ', _.assign({}, root));
    console.groupEnd();
}


function cacheElement2(root, element) {
    console.group('cache');
    console.log('element.props.domPath: ', element.props.domPath);
    var path = paths.parsePath(element.props.domPath || './');
    var dir = (path.relativeDirectory === paths.CWD
        && element.props.dir || []
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
    } else {
        console.log(_(dir)
            .dropRight(path.upwardLevels).value());

        var newDir = _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                if (!node) {
                    console.log('cwd2: ', cwd);
                    var pos2 = findChildByType(cwd.children, element);
                    console.log('pos2: ', pos2);
                    if (pos2 < 0) {
                        pos2 = cwd.children.push({
                            entity: element,
                            children: []
                        }) - 1;
                    }
                    return cwd.children[pos2];
                }
                console.log('cwd: ', cwd);
                var pos = findChildByType(cwd.children, node);
                console.log('pos: ', pos);
                if (pos < 0) {
                    pos = cwd.children.push({
                        entity: node,
                        children: []
                    }) - 1;
                }
                return cwd.children[pos];

            }, root);


    }

    console.log('newDir: ', _.assign({}, newDir));

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


function findChildByType(children, type) {
    for (var i = 0, len = children.length; i < len; i ++) {
        if (children[i] && children[i].entity === type) {
            return i;
        }
    }
    return -1;
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


function traverseAndConstruct(element) {
    console.log('construct: ', element);

    if (!element || _.isEmpty(element) || !element.entity) {
        return void 0;
    }
    if (!element.children || _.isEmpty(element.children)) {
        return element.entity;
    }

    var children ;

    if (_.isArray(element.children)) {
        children = _.map(element.children, function(child) {
            return traverseAndConstruct(child);
        })
    } else {
        children = traverseAndConstruct(element.children);
    }

    if (React.isValidElement(element.entity)) {
        console.group('Reconstructr: ', helper.getNodeName(element.entity));
        console.log('old-children: ', element.entity.props.children);
        console.log('replace-children: ', children);
        var ele = React.cloneElement(element.entity, null, children);
        console.log('new-children: ', ele.props.children);
        console.groupEnd();
        return ele;
    }
    return React.createElement(element.entity, null, children);
}


function traverse(root, element) {

    console.log('traverse-element: ', element);
    console.log('root: ', root);

    if (!_.has(root, 'children')) {
//        var tree = root;
//        root = {
//            entity: element,
//            children: []
//        };
        _.assign(root, {
            entity: element,
            children: []
        });
    } else {
        cacheElement2(root, element);
    }

    React.Children.forEach(element.props.children, function(child) {
//        var newChild = React.cloneElement(child, {});
       traverse(root, child);
    });
}

function walk(tree, element) {
    var root = tree;

    if (!_.has(tree, 'children')) {
        root = {
            entity: element,
            children: []
        };
        _.assign(tree, root);
    }
    return root;
}