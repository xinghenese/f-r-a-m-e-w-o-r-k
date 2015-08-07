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
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }

        var list = _.map(data, function (data, key) {
            var id = data.id || key;
            var item = _.isFunction(this.renderItem)
                && this.renderItem(data, _.omit(this.props, 'data'), id);
            var props = _({key: id}).set(DATA_ITEM_ID_FIELD, id).value();

            if (!item) {
                return null;
            }
            return React.cloneElement(
                item,
                props
            );
        }, this);

        return (
            <ul {...(_.pick(this.props, ['id', 'className', 'style']))}>{list}</ul>
        );
    }
};

// module initialization


// private functions
