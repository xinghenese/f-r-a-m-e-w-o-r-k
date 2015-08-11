/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var fields = require('./fields');

// private fields
var SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

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

        var target = event && event.currentTarget;
        var key = target && target.getAttribute(DATA_ITEM_KEY_FIELD);
        var component = key && this.refs[key];
        var selectedKey = this.state && this.state.selectedKey;
        var selectedComponent = this.refs[SELECT_REF_FIELD];

        if (!component
            || (selectedKey && key == selectedKey)
            || (selectedComponent && component === selectedComponent)
        ) {
            return;
        }

        if (_.isFunction(this.props[hoverType])) {
            this.props[hoverType](_.assign(event, {
                selectedKey: key,
                selectedId: component.props[DATA_ITEM_ID_FIELD],
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
