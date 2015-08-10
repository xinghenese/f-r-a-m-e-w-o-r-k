/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var fields = require('./fields');
var setStyle = require('../../../../style/styles').setStyle;

// private fields
var SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var LAST_SELECT_REF_FIELD = fields.LAST_SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedId: -1};
    },
    _onSelect: function (event) {
        var target = event && event.currentTarget;
        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);
        var component = id && this.refs[id];
        var lastSelectedId = this.state.selectedId;
        var lastSelectedComponent = this.refs[lastSelectedId];

        if (!component
            || (lastSelectedId && id == lastSelectedId)
            || (lastSelectedComponent && component === lastSelectedComponent)
        ) {
            return;
        }
        this.setState({selectedId: id});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(_.assign(event, {
                selectedId: id,
                currentComponent: component,
                previousComponent: lastSelectedComponent
            }));
        }
    },
    _onSiblingSelect: function (offset) {
        var selectedComponent = this.refs[SELECT_REF_FIELD];
        var currentSelectedItem = React.findDOMNode(selectedComponent);
        var target;
        offset = ~~(Number(offset));

        if (offset > 0) {
            target = currentSelectedItem && currentSelectedItem.nextSibling;
        } else if (offset < 0) {
            target = currentSelectedItem && currentSelectedItem.previousSibling;
        }

        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);
        var component = id && this.refs[id];

        if (!component) {
            return;
        }

        this.setState({selectedId: id});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect({
                currentTarget: target,
                selectedId: id,
                currentComponent: component
            });
        }
    },
    renderItem: function (item) {
        if (!React.isValidElement(item)) {
            return null;
        }

        var id = item.props[DATA_ITEM_ID_FIELD];
        var selected = this.state.selectedId == id;
        var props = {
            selected: selected,
            onClick: this._onSelect
        };

        return React.cloneElement(item, props);
    }
};

// module initialization


// private functions
