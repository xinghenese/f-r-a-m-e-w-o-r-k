/**
 * Created by Administrator on 2015/7/17.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var paths = require('../../../utils/paths');
var helper = require('./traverseSubNodes');
var emitter = require('../../../utils/eventemitter');

//private fields


//core module to export
module.exports = {
    reconstruct: reconstruct
};

//module initialization


//private functions
function reconstruct(topOwnedNode, ownerNode) {
    var domTreeObj = traverseAndRecreateDomTreeObject(topOwnedNode, ownerNode);
    return traverseAndReconstructReactTree(domTreeObj);
}

function traverseAndReconstructReactTree(element) {
    if (!element || _.isEmpty(element) || !element.entity) {
        return void 0;
    }
    if (!element.children || !_.isArray(element.children)) {
        return element.entity;
    }

    var children;

    if (!_.isEmpty(element.children) ) {
        children = _.map(element.children, function(child) {
            return traverseAndReconstructReactTree(child);
        });
    }

    if (React.isValidElement(element.entity)) {
        return React.cloneElement(element.entity, element.props, children);
    }
    element = modifyElement(element);
    return React.createElement(element.entity, element.props, children);
}

function traverseAndRecreateDomTreeObject(element, parent, root) {
    root = root || {};

    if (!_.has(root, 'children')) {
        _.assign(root, {
            entity: element,
            children: []
        });
    } else {
        cacheElementInDomTreeObject(element, parent, root);
    }

    React.Children.forEach(element.props.children, function(child) {
        var props = _({})
                .assign(element.props, child.props, {
                    superUpdateEvent: generateEventTypeByElement(element),
                    updateEvent: generateEventTypeByElement(child),
                    data: element.props.data || element.props.store
                })
                .omit(['children', 'domPath', 'handler', 'className', 'style', 'id', 'props'])
                .value()
            ;
        traverseAndRecreateDomTreeObject(React.cloneElement(
            child,
            props
        ), element, root);
    });

    return root;
}

//cache the element in root {module.exports._domTree.root}.
function cacheElementInDomTreeObject(element, parent, root) {
    var path = paths.parsePath(element.props.domPath
        && element.props.domPath + '/'
        || './'
    );
    var dir = (path.relativeDirectory === paths.CWD
        && element.props.dir || []
        ).concat(path.subPath);
    var depth = dir.length - path.upwardLevels;
    var elementName = helper.getNodeName(element);

    if (depth < 0) {
        //no insertion;
    } else {
        _(dir)
            .dropRight(path.upwardLevels)
            .reduce(function(cwd, node) {
                //reach the end of dir array.
                if (!node) {
                    var pos2 = findChildByType(cwd.children, element);

                    if (pos2 < 0) {
                        pos2 = cwd.children.push({
                            entity: element,
                            children: [],
                            props: {
                                className: element.props.className
                                    || getHandlerName(element.props.handler).toLowerCase()
                            }
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

function findChildByType(children, type) {
    for (var i = 0, len = children.length; i < len; i ++) {
        if (children[i] && children[i].entity === type) {
            return i;
        }
    }
    return -1;
}

function generateEventTypeByElement(element) {
    var path = element.props.domPath || '';
    var nodeName = helper.getNodeName(element) + '/';
    var handlerName = getHandlerName(element.props.handler);

    return path + nodeName + handlerName;
}

function modifyElement(element) {
    var infos = element.entity.match(/^(.+?)([#.])(.*)$/) || ['', element.entity];

    element.entity = _.has(React.DOM, infos[1]) ? infos[1] : 'div';

    if (!infos[3]) {
        return element;
    }

    element.props = element.props || {};

    if (infos[2] === '#') {
        var subInfos = infos[3].match(/^(.+?)\.(.*)$/) || ['', infos[3]];
        _.set(element.props, 'id', subInfos[1]);
        infos[3] = subInfos[2];
    }

    var originalClassName = element.props.className;
    var newClassNames = infos[3].replace('.', ' ');
    if (!originalClassName) {
        _.set(element.props, 'className', newClassNames);
    } else {
        _.set(element.props, 'className', originalClassName + ' ' + newClassNames);
    }

    return element;
}

function getHandlerName(handler) {
    if (!handler) {
        return '';
    }
    if (_.isString(handler)) {
        return handler;
    }
    if (_.isFunction(handler)) {
        return handler.displayName || handler.tagName || 'component'
    }
    return helper.getNodeName(handler);
}