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
        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);
        var component = id && this.refs[id];
        var selectedId = this.state && this.state.selectedId;
        var selectedComponent = this.refs[SELECT_REF_FIELD];

        if (!component
            || (selectedId && id == selectedId)
            || (selectedComponent && component === selectedComponent)
        ) {
            return;
        }

        if (_.isFunction(this.props[hoverType])) {
            this.props[hoverType](_.assign(event, {
                selectedId: id,
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
