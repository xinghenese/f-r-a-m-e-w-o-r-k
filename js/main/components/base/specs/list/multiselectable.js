/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var fields = require('./fields');

// private fields
var CURRENT_SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    getInitialState: function () {
        return {selectedIds: []};
    },
    _onSelect: function (event) {
        var target = event && event.currentTarget;
        var id = target && target.getAttribute(DATA_ITEM_ID_FIELD);
        var component = id && this.refs[id];

        if (!component) {
            return;
        }

        var ids = this.state.selectedIds;
        var index = _.indexOf(ids, id);

        if (index > -1) {
            ids.splice(index, 1);
            this.setState({selectedIds: ids});
            if (_.isFunction(this.props.onUnselect)) {
                this.props.onUnselect({
                    id: id,
                    currentTarget: target,
                    currentComponent: component
                });
            }
        } else {
            ids.push(id);
            this.setState({selectedIds: ids});
            if (_.isFunction(this.props.onSelect)) {
                this.props.onSelect({
                    id: id,
                    currentTarget: target,
                    currentComponent: component
                });
            }
        }
    },
    render: function (list) {
        var items = React.Children.map(list.props.children, function (child) {
            var id = child.props[DATA_ITEM_ID_FIELD];
            var selected = _.includes(this.state.selectedId, id);
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
