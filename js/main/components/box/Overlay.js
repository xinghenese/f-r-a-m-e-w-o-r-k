/**
 * Created by Administrator on 2015/8/14.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var commonStyle = require('../../style/common');

// private fields
var globalMask = null;

// exports
module.exports = {
    show: function (element) {
        if (!globalMask) {
            globalMask = document.body.appendChild(document.createElement('div'));
            globalMask.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999';
            globalMask.onclick = function (event) {
                if (globalMask === event.target) {
                    React.unmountComponentAtNode(globalMask);
                    globalMask.style.visibility = 'hidden';
                }
            }
        }

        if (!element) {
            return null;
        }

        var newStyle = _.assign({}, element.props.style, commonStyle.absoluteCenter);
        var newProps = _.assign({}, element.props, {style: newStyle});
        var node;

        if (React.isValidElement(element)) {
            node = React.cloneElement(element, newProps);
        } else {
            node = React.createElement(element, newProps, newProps.children);
        }

        React.render(node, globalMask);
        globalMask.style.visibility = 'visible';
    },
    hide: function () {
        if (globalMask) {
            React.unmountComponentAtNode(globalMask);
            globalMask.style.visibility = 'hidden';
        }
    }
};

// module initialization


// private functions
