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
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedId: -1};
    },
    _onHoverIn: function (event) {
        var target = event && event.currentTarget;

        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);

        if (!id || id === this.state.selectedId) {
            return;
        }

        if (_.isFunction(this.props.onHoverIn)) {
            this.props.onHoverIn(_.assign(event, {selectedId: id}));
        }
    },
    _onHoverOut: function (event) {
        var target = event && event.currentTarget;
        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);

        if (!id || id === this.state.selectedId) {
            return;
        }

        if (_.isFunction(this.props.onHoverOut)) {
            this.props.onHoverOut(_.assign(event, {selectedId: id}));
        }
    },
    _onSelect: function (event) {
        var target = event && event.currentTarget;
        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);

        console.info('_onSelect: ', event);


        if (!id || id === this.state.selectedId) {
            return;
        }
        this.setState({selectedId: id});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(_.assign(event, {selectedId: id}));
        }
    },
    _onSiblingSelect: function (offset) {
        var currentSelectedItem = React.findDOMNode(this.refs[SELECT_REF_FIELD]);
        var target;
        offset = ~~(Number(offset));

        if (offset > 0) {
            target = currentSelectedItem.nextSibling;
        } else if (offset < 0) {
            target = currentSelectedItem.previousSibling;
        }

        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);
        if (!id) {
            return;
        }

        this.setState({selectedId: id});

        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect({
                currentTarget: target,
                selectedId: id
            });
        }
    },
    render: function (list) {
        if (!React.isValidElement(list)) {
            return null;
        }

        var items = React.Children.map(list.props.children, function (child) {
            var id = child.props[DATA_ITEM_ID_FIELD];
            var selected = this.state.selectedId == id;
            var props = {
                selected: selected,
                onClick: this._onSelect,
                onMouseEnter: this._onHoverIn,
                onMouseLeave: this._onHoverOut
            };

            if (selected) {
                child = React.cloneElement(child, {ref: SELECT_REF_FIELD});
            }
            return React.cloneElement(child, props);
        }, this);

        return React.cloneElement(list, null, items);
    }
};

// module initialization


// private functions
