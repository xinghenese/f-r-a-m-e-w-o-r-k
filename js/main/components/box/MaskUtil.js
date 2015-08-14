/**
 * Created by Administrator on 2015/8/14.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

// private fields
var globalMask = null;

// exports
module.exports = {
    show: function (element) {
        if (!globalMask) {
            globalMask = document.body.appendChild(document.createElement('div'));
            globalMask.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.7);'
        }

        if (!React.isValidElement(element)) {
            return;
        }

        React.render(React.cloneElement(element, {
            style: _.assign({}, element.props.style, {position:'absolute', margin: 'auto'})
        }), globalMask);
    },
    hide: function () {
        if (globalMask) {
            React.unmountComponentAtNode(globalMask);
        }
    }
};

// module initialization


// private functions
