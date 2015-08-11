/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var fields = require('./fields');

// private fields
var CURRENT_SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedKeys: []};
    },
    _onSelect: function (event) {
        var target = event && event.currentTarget;
        var key = target && target.getAttribute(DATA_ITEM_KEY_FIELD);
        var component = key && this.refs[key];

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
    },
    render: function (list) {
        var items = React.Children.map(list.props.children, function (child) {
            var key = child.props[DATA_ITEM_KEY_FIELD];
            var selected = _.includes(this.state.selectedKeys, key);
            var props = {
                selected: selected,
                onClick: this._onSelect,
                onMouseEnter: this._onHoverIn,
                onMouseLeave: this._onHoverOut
            };

            return React.cloneElement(child, props);
        }, this);

        return React.cloneElement(list, null, items);
    }
};

// module initialization


// private functions
