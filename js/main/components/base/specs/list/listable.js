/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var fields = require('./fields');
var makeStyle = require('../../../../style/styles').makeStyle;

// private fields
var SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    renderItem: function () {
        return null;
    },
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }

        var listProps = _(this.props)
            .omit('data')
            .set('style', makeStyle(this.props.style))
            .value();
        var listClassName = this.props.className;
        var listStyle = this.props.style || {};

        var list = _.map(data, function (data, key) {
            var itemId = data.id || key;
            var itemProps = _({
                key: itemId,
                ref: itemId,
                className: listClassName && listClassName + '-item',
                style: listStyle.item
            })
                .set(DATA_ITEM_ID_FIELD, itemId)
                .value();
            var item = _.isFunction(this.renderItem)
                && this.renderItem(data, itemId, _.clone(itemProps));

            if (!item) {
                return null;
            }

            if (React.isValidElement(item) && item.type.toLowerCase() === 'li') {
                return React.cloneElement(
                    item,
                    itemProps
                )
            }

            return React.createElement(
                'li',
                itemProps,
                item
            );
        }, this);

        return (
            <ul {...listProps}>{list}</ul>
        );
    }
};

// module initialization


// private functions
