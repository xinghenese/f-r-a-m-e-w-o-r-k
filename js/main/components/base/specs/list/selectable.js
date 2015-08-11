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
        if (!this._itemIds || _.isEmpty(this._itemIds)) {
            return;
        }

        var selectedId = this.state.selectedId;
        var selectedComponent = this.refs[selectedId];
        var position = _.indexOf(this._itemIds, selectedId);
        var targetComponent;
        var nextSelectedId;
        offset = ~~(Number(offset));

        if (offset > 0) {
            nextSelectedId = this._itemIds[position+1];
        } else if (offset < 0) {
            nextSelectedId = this._itemIds[position-1];
        }

        targetComponent = nextSelectedId && this.refs[nextSelectedId];

        if (!targetComponent) {
            return;
        }

        this.setState({selectedId: nextSelectedId});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect({
                currentTarget: React.findDOMNode(targetComponent),
                selectedId: nextSelectedId,
                currentComponent: targetComponent,
                previousComponent: selectedComponent
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
