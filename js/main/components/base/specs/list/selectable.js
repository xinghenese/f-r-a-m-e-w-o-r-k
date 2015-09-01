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
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedKey: -1, enableSelect: !!this.props.intialEnableSelect};
    },
    getDefaultProps: function () {
        return {intialEnableSelect: true};
    },
    enableSelect: function () {
        this.setState({enableSelect: true});
    },
    disableSelect: function () {
        this.setState({enableSelect: false, selectedKey: -1});
    },
    getSelectedItem: function () {
        return React.findDOMNode(this.refs[this.state.selectedKey]);
    },
    checkItemSelected: function (item) {
        return this.state.selectedKey == (item && item.props && item.props[DATA_ITEM_KEY_FIELD] || item);
    },
    selectSibling: function (offset) {
        if (!this.state.enableSelect || !this._itemKeys || _.isEmpty(this._itemKeys)) {
            return;
        }

        var selectedKey = parseInt(this.state.selectedKey);
        var selectedComponent = this.refs[selectedKey];
        var position = _.indexOf(this._itemKeys, selectedKey);
        var targetComponent;
        var nextSelectedKey;
        offset = ~~(Number(offset));

        if (offset > 0) {
            nextSelectedKey = this._itemKeys[position + 1];
        } else if (offset < 0) {
            nextSelectedKey = this._itemKeys[position - 1];
        }

        targetComponent = nextSelectedKey && this.refs[nextSelectedKey];

        if (!targetComponent) {
            return;
        }

        this.setState({selectedKey: nextSelectedKey});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect({
                currentTarget: React.findDOMNode(targetComponent),
                selectedKey: nextSelectedKey,
                currentComponent: targetComponent,
                previousComponent: selectedComponent
            });
        }
    },
    _onSelect: function (event) {
        if (!this.state.enableSelect) {
            return;
        }

        var target = event && event.currentTarget;
        var selectedKey = target && target.getAttribute(DATA_ITEM_KEY_FIELD);
        selectedKey = !isNaN(parseInt(selectedKey, 10)) ? parseInt(selectedKey, 10) : selectedKey;
        var component = this.refs[selectedKey];
        var lastSelectedKey = this.state.selectedKey;
        var lastSelectedComponent = this.refs[lastSelectedKey];

        if (!component
            || (lastSelectedKey && selectedKey == lastSelectedKey)
            || (lastSelectedComponent && component === lastSelectedComponent)
        ) {
            return;
        }

        this.setState({selectedKey: selectedKey});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(_.assign(event, {
                selectedKey: selectedKey,
                currentComponent: component,
                previousComponent: lastSelectedComponent
            }));
        }
    },
    componentWillMount: function () {
        this._shouldResetItemKeys = true;
        this._itemKeys = [];
    },
    renderItem: function (item) {
        if (!React.isValidElement(item)) {
            return null;
        }

        if (this._shouldResetItemKeys) {
            this._itemKeys = [];
            this._shouldResetItemKeys = false;
        }

        var itemKey = !isNaN(parseInt(item.key, 10)) ? parseInt(item.key, 10) : item.key;
        this._itemKeys.push(itemKey);

        //console.info('item.key: ', itemKey);

        return React.cloneElement(
            item,
            _.set({onClick: this._onSelect}, DATA_ITEM_KEY_FIELD, itemKey)
        );
    },
    render: function (item) {
        //console.info('itemKeys: ', this._itemKeys);
        this._shouldResetItemKeys = true;
        return item;
    }
};

// module initialization


// private functions
