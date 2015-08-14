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
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedKeys: [], enableSelect: !!this.props.intialEnableSelect};
    },
    getDefaultProps: function () {
        return {intialEnableSelect: true};
    },
    enableSelect: function () {
        this.setState({enableSelect: true});
    },
    disableSelect: function () {
        this.setState({enableSelect: false, selectedKeys: []});
    },
    _onSelect: function (event) {
        if (!this.state.enableSelect) {
            return;
        }

        var target = event && event.currentTarget;
        var key = target && target.getAttribute(DATA_ITEM_KEY_FIELD);
        key = parseInt(key, 10) || key;
        var component = key && this.refs[key];
        var lastSelectedKey = this.state.selectedKey;
        var lastSelectedComponent = this.refs[lastSelectedKey];

        if (!component
            || (lastSelectedKey && key == lastSelectedKey)
            || (lastSelectedComponent && component === lastSelectedComponent)
        ) {
            return;
        }

        this.setState({selectedKey: key});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(_.assign(event, {
                selectedKey: key,
                selectedId: component.props[DATA_ITEM_ID_FIELD],
                currentComponent: component,
                previousComponent: lastSelectedComponent
            }));
        }
    },
    _onSiblingSelect: function (offset) {
        if (!this.state.enableSelect || !this._itemKeys || _.isEmpty(this._itemKeys)) {
            return;
        }

        var selectedKey = parseInt(this.state.selectedKey);
        var selectedComponent = this.refs[selectedKey];
        var position = _.indexOf(this._itemKeys, selectedKey);
        var targetComponent;
        var nextselectedKey;
        offset = ~~(Number(offset));

        if (offset > 0) {
            nextselectedKey = this._itemKeys[position + 1];
        } else if (offset < 0) {
            nextselectedKey = this._itemKeys[position - 1];
        }

        targetComponent = nextselectedKey && this.refs[nextselectedKey];

        if (!targetComponent) {
            return;
        }

        this.setState({selectedKey: nextselectedKey});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect({
                currentTarget: React.findDOMNode(targetComponent),
                selectedKey: nextselectedKey,
                selectedId: targetComponent.props[DATA_ITEM_ID_FIELD],
                currentComponent: targetComponent,
                previousComponent: selectedComponent
            });
        }
    },
    renderItem: function (item) {
        if (!React.isValidElement(item)) {
            return null;
        }

        var key = item.props[DATA_ITEM_KEY_FIELD];
        var selected = this.state.selectedKey == key;
        var props = {
            selected: selected,
            onClick: this._onSelect
        };

        return React.cloneElement(item, props);
    }
};

// module initialization


// private functions
