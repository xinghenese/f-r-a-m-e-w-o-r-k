/**
 * Created by Administrator on 2015/8/7.
 */
'use strict';

// dependencies
var _ = require('lodash');
var fields = require('./fields');
var listable = require('./listable');

// private fields
var SELECT_REF_FIELD = fields.SELECT_REF_FIELD;
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;

// exports
module.exports = {
    renderGroupTitle: function () {
        return null;
    },
    renderItem: function () {
        return null;
    },
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data) || this.props.groupBy) {
            return null;
        }

        var listProps = _(this.props)
            .omit('data')
            .set('style', makeStyle(this.props.style))
            .value();

        data = _.groupBy(data, this.props.groupBy);

        var groupClassName = this.props.className && this.props.className + '-group';
        var groupStyle = this.props.style && this.props.style.group || {};

        var list = _.map(data, function (data, key) {
            var id = data.id || key;
            var groupTitle = _.isFunction(this.renderGroupTitle)
                && this.renderGroupTitle(data, id, this.props);

            var group = listable.render.call({
                props: {
                    data: data,
                    className: groupClassName,
                    style: groupStyle
                }
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
