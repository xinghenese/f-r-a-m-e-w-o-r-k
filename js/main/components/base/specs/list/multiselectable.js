/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var fields = require('./fields');
var Selectable = require('./selectable');

// private fields
var CURRENT_SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

// exports
module.exports = _.create(Selectable, {
    getInitialState: function () {
        return {selectedKeys: [], enableSelect: !!this.props.intialEnableSelect};
    },
    disableSelect: function () {
        this.setState({enableSelect: false, selectedKeys: []});
    },
    checkItemSelected: function (item) {
        return _.includes(this.state.selectedKey, (item && item.props && item.props[DATA_ITEM_KEY_FIELD] || item));
    },
    selectAll: function () {
        if (this.state.enableSelect && _.isArray(this._itemKeys)) {
            this.setState({selectedKeys: this._itemKeys.slice(0)});
        }
    },
    unselectAll: function () {
        if (this.state.enableSelect) {
            this.setState({selectedKeys: []});
        }
    },
    _onSelect: function (event) {
        if (!this.state.enableSelect) {
            return;
        }

        var target = event && event.currentTarget;
        var key = target && target.getAttribute(DATA_ITEM_KEY_FIELD);
        key = !isNaN(parseInt(key, 10)) ? parseInt(key, 10) : key;
        var component = this.refs[key];

        if (!component) {
            return;
        }

        var keys = this.state.selectedKeys;
        var index = _.indexOf(keys, key);

        if (index > -1) {
            keys.splice(index, 1);
            this.setState({selectedKeys: keys});
            if (_.isFunction(this.props.onUnselect)) {
                this.props.onUnselect({
                    id: key,
                    currentTarget: target,
                    currentComponent: component
                });
            }
        } else {
            keys.push(key);
            this.setState({selectedKeys: keys});
            if (_.isFunction(this.props.onSelect)) {
                this.props.onSelect({
                    id: key,
                    currentTarget: target,
                    currentComponent: component
                });
            }
        }
    }
});

// module initialization


// private functions
