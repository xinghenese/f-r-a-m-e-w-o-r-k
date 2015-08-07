/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Avatar = require('../../avatar');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields


//core module to export
var ConversationListItem = React.createClass({
    render: function () {
        var currentStyle = style.conversationlist.item.default;

        if (this.props.selected) {
            currentStyle = style.conversationlist.item.active;
        }

        var liProps = _.omit(this.props, ['style', 'className', 'senderName', 'senderAvatar', 'time', 'unreadCount', 'senderName']);

        return (
            <li
                className={this.props.className + '-item'}
                style={makeStyle(style.conversationlist.item, currentStyle)}
                {...liProps}
                >
                <Avatar
                    className="conversation-list-item-avatar"
                    /* props */
                    name={this.props.senderName}
                    src={this.props.senderAvatar}
                    index={this.props['data-item-id']}
                    /* style */
                    style={style.conversationlist.item.avatar}
                />

                <div
                    className="conversation-list-item-info"
                    style={makeStyle(style.conversationlist.item.info)}
                    >
                    <div
                        className="conversation-list-item-time"
                        style={makeStyle(style.conversationlist.item.time)}
                        >
                        {this.props.time}
                    </div>
                    <div
                        className="conversation-list-item-unread-count"
                        style={makeStyle(style.conversationlist.item.unread)}
                        >
                        {this.props.unreadCount || 0}
                    </div>
                </div>
                <div className="conversation-list-item-body">
                    <div
                        className="conversation-list-item-nickname"
                        style={makeStyle(style.conversationlist.item.title)}
                        >
                        {this.props.senderName}
                    </div>
                    <p
                        className="conversation-list-item-content"
                        style={makeStyle(style.conversationlist.item.message)}
                        >
                        {this.props.children}
                    </p>
                </div>
            </li>
        )
    }
});

module.exports = ConversationListItem;
