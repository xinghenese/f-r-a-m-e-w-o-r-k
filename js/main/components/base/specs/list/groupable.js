/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');
var fields = require('./fields');
var listable = require('./listable');
var makeStyle = require('../../../../style/styles').makeStyle;

// private fields
var SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    renderGroupTitle: function (title) {
        return title;
    },
    renderItem: function (item) {
        return item;
    },
    _itemIds: [],
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data) || this.props.groupBy) {
            return null;
        }

        var listProps = _(this.props)
            .omit('data')
            .set('style', makeStyle(this.props.style))
            .value();

        data = _.groupBy(data, this.groupBy);

        var groupClassName = this.props.className && this.props.className + '-group';
        var groupStyle = this.props.style && this.props.style.group || {};
        var groupTitleClassName = groupClassName + '-title';
        var groupTitleStyle = groupStyle && groupStyle.title || {};

        var list = _.map(data, function (data, key) {
            var id = data.id || key;
            var groupTitle = _.isFunction(this.renderGroupTitle)
                && this.renderGroupTitle(data, {
                    className: groupTitleClassName,
                    style: groupTitleStyle
                }, id);

            var group = listable.render.call({
                props: {
                    data: data,
                    className: groupClassName,
                    style: groupStyle
                },
                renderItem: this.renderItem,
                _itemIds: this._itemIds
            });

            return [groupTitle, group];
        }, this);

        return (
            <ul {...listProps}>{list}</ul>
        );
    }
};

// module initialization


// private functions
