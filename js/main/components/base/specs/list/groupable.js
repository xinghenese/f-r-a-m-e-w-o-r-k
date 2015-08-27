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
var DATA_ITEM_KEY_FIELD = fields.DATA_ITEM_KEY_FIELD;

var currentItemKey;

// exports
module.exports = {
    renderItem: function (item) {
        if (React.isValidElement(item)) {
            return React.cloneElement(item, {key: currentItemKey, ref: currentItemKey});
        }
    },
    render: function () {
        var dataList = _.isFunction(this.preprocessData) && this.preprocessData(this.props.data) || this.props.data;

        // check whether data is empty and render a default element by renderByDefault
        if (!dataList || _.isEmpty(dataList)) {
            var defaultList = _.isFunction(this.renderByDefault) && this.renderByDefault();
            return React.isValidElement(defaultList) ? defaultList : null;
        }

        // render groupedList
        var groupedList = _.reduce(dataList, function (acc, dataGroup, key) {
            // render group title
            var groupTitle = _.isFunction(this.renderTitle) && this.renderTitle(dataGroup, key);
            acc.push(React.isValidElement(groupTitle) ? React.cloneElement(groupTitle, {key: key}) : null);

            // render group items
            return acc.concat(_.map(dataGroup, function (data, key) {
                data = Object(data);
                key = data.key || data.id || key;
                currentItemKey = !isNaN(parseInt(key, 10)) ? parseInt(key, 10) : key;

                var item = _.isFunction(this.renderItem) && this.renderItem(data, currentItemKey);

                if (!item) { return null; }

                if (!React.isValidElement(item)) {
                    // TODO: renderItem().props should be merged into itemProps
                    return React.cloneElement('div', item.props);
                }
                return item;

            }, this))
        }, [], this);

        return (
            <div {..._.omit(this.props, ['data'])}>{groupedList}</div>
        );
    }
};

// module initialization


// private functions
