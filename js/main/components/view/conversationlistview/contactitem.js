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
    render: function () {
        var currentStyle = style.conversationlist.item.default;

        if (this.props.selected) {
            currentStyle = style.conversationlist.item.active;
        }

        return (
            <li className="contact-list-item"
                id={this.props.index}
                style={makeStyle(style.conversationlist.item, currentStyle)}
                onClick={this.props.onSelect}
                onMouseEnter={onhoverin(this)}
                onMouseLeave={onhoverout(this)}
                data-contact-type={this.props.contactType}
                data-contact-id={this.props.contactId}
            >
                <Avatar
                    className="contact-list-item-avatar"
                    style={style.conversationlist.item.avatar}
                    name={this.props.contactName}
                    src={this.props.contactAvatar}
                    index={this.props.index}
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

//module initialization


//private functions
function onhoverin(item) {
    return function (event) {
        if (!item.props.selected) {
            setStyle(event.currentTarget.style, style.conversationlist.item.hover);
        }
    };
}

function onhoverout(item) {
    return function (event) {
        if (!item.props.selected) {
            setStyle(event.currentTarget.style, style.conversationlist.item.default);
        }
    };
}
