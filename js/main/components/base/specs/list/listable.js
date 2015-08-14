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
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

// exports
module.exports = {
    renderItem: function (item) {
        return item;
    },
    _itemKeys: [],
    render: function () {
        if (!this.shouldKeepItemKeys) {
            this._itemKeys = [];
        }

        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }

        var listProps = _(this.props)
            .omit('data')
            .set('style', makeStyle(this.props.style))
            .value();
        var listClassName = this.props.className;
        var listStyle = this.props.style && _.clone(this.props.style) || {};

        var list = _.map(data, function (data, key) {
            data = Object(data);
            var itemKey = parseInt(data.key || data.id || key, 10) || key;

            // TODO: create keys more reasonably
            while (_.includes(this._itemKeys, itemKey)) {
                itemKey = parseInt(itemKey, 10) + 1;
            }
            data.key = itemKey;
            data.id = data.id || key;

            var itemProps = _({
                key: itemKey,
                ref: itemKey,
                className: listClassName && listClassName + '-item',
                style: listStyle.item && _.clone(listStyle.item) || {}
            })
                .set(DATA_ITEM_KEY_FIELD, itemKey)
                .set(DATA_ITEM_ID_FIELD, data.id)
                .value();

            var item = _.isFunction(this.renderItem)
                && this.renderItem(data, _.clone(itemProps), itemKey);

            if (!item) {
                return null;
            }

            if (!_.includes(this._itemKeys, itemKey)) {
                this._itemKeys.push(itemKey);
            }

            _.assign(itemProps.style, item.props.style);

            if (React.isValidElement(item) && item.type.toLowerCase() === 'li') {
                return React.cloneElement(
                    item,
                    itemProps
                )
            }

            // TODO: renderItem().props should be merged into itemProps
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
