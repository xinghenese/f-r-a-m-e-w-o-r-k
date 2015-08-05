/**
 * Created by Administrator on 2015/7/27.
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
var ContactItem = React.createClass({
    _hoverIn: function () {
        if (!this.props.selected) {
            setStyle(
                React.findDOMNode(this).style,
                style.conversationlist.item.hover
            );
        }
    },
    _hoverOut: function () {
        if (!this.props.selected) {
            setStyle(
                React.findDOMNode(this).style,
                style.conversationlist.item.default
            );
        }
    },
    render: function () {
        var currentStyle = style.conversationlist.item.default;

        if (this.props.selected) {
            currentStyle = style.conversationlist.item.active;
        }

        return (
            <li className="contact-list-item"
                /* data-* attributes */
                data-contact-type={this.props.contactType}
                data-contact-id={this.props.contactId}
                /* event handler */
                onClick={this.props.onSelect}
                onMouseEnter={this._hoverIn}
                onMouseLeave={this._hoverOut}
                /* style */
                style={makeStyle(style.conversationlist.item, currentStyle)}
            >
                <Avatar
                    className="contact-list-item-avatar"
                    name={this.props.contactName}
                    src={this.props.contactAvatar}
                    index={this.props.contactId}
                    style={style.conversationlist.item.avatar}
                    />

                <div className="contact-list-item-body">
                    <div
                        className="contact-list-item-nickname"
                        style={makeStyle(style.conversationlist.item.title)}
                        >
                        {this.props.contactName}
                    </div>
                    <p
                        className="contact-list-item-last-appearance"
                        style={makeStyle(style.conversationlist.item.message)}
                        >
                        {this.props.message}
                    </p>
                </div>
            </li>
        )
    }
});

module.exports = ContactItem;
