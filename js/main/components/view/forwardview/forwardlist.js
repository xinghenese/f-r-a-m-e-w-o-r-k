/**
 * Created by Administrator on 2015/8/14.
 */
'use strict';

// dependencies
var _ = require('lodash');
var React = require('react');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var multiselectableMixin = require('../../base/specs/list/multiselectable');

// private fields
var createGroupClass = createGenerator({
    mixins: [groupableMixin, multiselectableMixin]
});

// exports
module.exports = createGroupClass({
    displayName: 'ForwardList',
    getDefaultProps: function () {
        return {
            className: "forward-list",
            style: style.contactlist,
            groupBy: this.groupBy
        }
    },
    renderGroupTitle: function (data, props, key) {
        return (
            <div
                className={props.className + '-caption'}
                style={props.style.caption}
                >
                {Lang[key] || key}
            </div>
        )
    },
    renderItem: function (data, props, key) {
        var className = props.className;
        var style = props.style;
        var liStyle = (key == this.state.selectedKey) && style.active;
        var checkbox = null;

        if (this.state.enableSelect) {
            checkbox = (
                <div
                    className={className + '-checkbox'}
                    style={style.checkbox}
                    dangerouslySetInnerHTML={{
                        __html: _.includes(this.state.selectedKeys, key) ? '&#10003;' : ''
                    }}
                    />
            );
        }

        return (
            <li data-conversation-type={data.type} style={liStyle}>
                <Avatar
                    className={className + '-avatar'}
                    name={data.name}
                    src={data.avatar}
                    index={key}
                    style={style.avatar}
                    />
                {checkbox}
                <div className={className + '-body'}>
                    <div
                        className={className + '-nickname'}
                        style={makeStyle(style.title)}
                        >
                        {data.name}
                    </div>
                    <p
                        className={className + '-last-appearance'}
                        style={makeStyle(style.message)}
                        >
                        { data.count && (data.count + ' people')
                        || (data.online && 'online' || (data.lastActiveTime + 'h ago'))}
                    </p>
                </div>
            </li>
        )
    },
    groupBy: function (data) {
        if (data.type === ConversationConstants.PRIVATE_TYPE) {
            return data.name[0];
        }
        return data.type;
    }
});

// module initialization


// private functions
