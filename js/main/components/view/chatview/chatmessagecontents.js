/**
 * Created by Administrator on 2015/8/27.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var Message = require('./chatmessage');

// private fields
var createListableClass = createGenerator({
    mixins: [listableMixin]
});

// exports
module.exports = createListableClass({
    displayName: 'ChatMessageContents',
    preprocessData: function (data) {
        if (!data) {
            return null;
        }
        if (!_.isArray(data)) {
            data = [data];
        }
        return {data: data};
    },
    renderItem: function (message, key) {
        return <Message className="content" data={message}/>;
    }
});

// module initialization


// private functions
