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
        traverse(this.ssRoot, this, this._domTree);
        console.log('this._domTree: ', this._domTree);
        var root = reconstructElement(this._domTree);
        console.log('root: ', root);
        React.render(root, document.getElementById('content1'));
    },
    render: function() {
        var children = React.Children.map(this.props.children, function(child) {
            return React.cloneElement(child, {emitter: this._emitter});
        }, this);
        this.ssRoot = <div {...this.props}>{children}</div>;
        return this.ssRoot;
    }
});

//module initialization


//private functions
function reconstructElement(domTree) {
    return traverseAndConstruct(domTree);
}

//cache the element in root {module.exports._domTree.root}.
function cacheElement(element, parent, root) {
    var path = paths.parsePath(element.props.domPath || './');
    var dir = (path.relativeDirectory === paths.CWD
        && element.props.dir || []
        ).concat(path.subPath);
    var depth = dir.length - path.upwardLevels;
    var elementName = helper.getNodeName(element);

    console.group(elementName, ': '
        + _.isString(element.props.handler)
            ? element.props.handler
            : helper.getNodeName(element.props.handler)
    );
    console.log('props: ', element.props);
    console.log('parent: ', parent);

    if (depth < 0) {
        //no insertion;
    } else {
        _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                if (!node) {
                    var pos2 = findChildByType(cwd.children, element);
                    if (pos2 < 0) {
                        pos2 = cwd.children.push({
                            entity: element,
                            children: []
                        }) - 1;
                    }
                    return cwd.children[pos2];
                }

                var pos = findChildByType(cwd.children, node);
                if (pos < 0) {
                    pos = cwd.children.push({
                        entity: node,
                        children: []
                    }) - 1;
                }
                return cwd.children[pos];

            }, root);


    }
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

function traverseAndConstruct(element) {
    if (!element || _.isEmpty(element) || !element.entity) {
        return void 0;
    }
    if (!element.children || !_.isArray(element.children)) {
        return element.entity;
    }

    var children;

    if (!_.isEmpty(element.children) ) {
        children = _.map(element.children, function(child) {
            return traverseAndConstruct(child);
        });
    }

    if (React.isValidElement(element.entity)) {
        return React.cloneElement(element.entity, element.props, children);
    }
    return React.createElement(element.entity, element.props, children);
}


function traverse(element, parent, root) {
    if (!_.has(root, 'children')) {
        _.assign(root, {
            entity: element,
            children: []
        });
    } else {
        cacheElement(element, {}, root);
    }

    React.Children.forEach(element.props.children, function(child) {
        console.log('traverse-foreach#element: ', element);
        traverse(React.cloneElement(
            child, 
            _.assign({}, element.props, child.props)
        ), root);
    });

    return root;
}