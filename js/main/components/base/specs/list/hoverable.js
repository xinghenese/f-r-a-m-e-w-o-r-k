/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

// private fields


// exports
module.exports = {
    _onHoverIn: function (event) {
        this._onHover(event);
    },
    _onHoverOut: function (event) {
        this._onHover(event, 'out');
    },
    _onHover: function (event, hoverType) {
        hoverType = String(hoverType).toLowerCase();
        hoverType = _.includes(['hoverout', 'mouseout', 'mouseleave', 'out'], hoverType)
            ? 'onHoverOut' : 'onHoverIn';

        if (_.isFunction(this.props[hoverType])) {
            this.props[hoverType](_.assign(event, {
                currentComponent: component
            }));
        }
    },
    renderItem: function (item) {
        if (!React.isValidElement(item)) {
            return null;
        }

        return React.cloneElement(item, {
            onMouseEnter: this._onHoverIn,
            onMouseLeave: this._onHoverOut
        });
    }
};

// module initialization


// private functions
