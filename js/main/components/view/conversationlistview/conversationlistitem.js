/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields
var avatarColors = {};

//core module to export
var ConversationListItem = React.createClass({
    render: function() {
        var currentStyle = style.conversationlist.item.default;

        if (this.props.selected) {
            currentStyle = style.conversationlist.item.active;
        }

        return (
          <li className="conversation-list-item"
              id={this.props.index}
              style={makeStyle(style.conversationlist.item, currentStyle)}
              onClick={this.props.onSelect}
              onMouseEnter={onhoverin(this)}
              onMouseLeave={onhoverout(this)}>
              <a
                  className="conversation-list-item-avatar"
                  style={makeStyle(style.conversationlist.item.avatar, {backgroundColor: getColor(this.props.index)})}
              >
                <img
                    alt={this.props.senderName[0] || ''}
                    src={this.props.senderAvatar}
                    width="100%"
                    height="100%"
                />
              </a>
              <div
                  className="conversation-list-item-time"
                  style={makeStyle(style.conversationlist.item.time)}
              >
                  {this.props.time}
              </div>
              <div className="conversation-list-item-body">
                  <div className="conversation-list-item-nickname"
                  style={makeStyle(style.conversationlist.item.title)}>
                      {this.props.senderName}
                  </div>
                  <p className="conversation-list-item-content"
                      style={makeStyle(style.conversationlist.item.message)}>
                      {this.props.children}
                  </p>
              </div>
          </li>
        )
    }
});

module.exports = ConversationListItem;

//module initialization


//private functions
function onhoverin(item) {
    return function(event) {
        if (!item.props.selected) {
            setStyle(event.currentTarget.style, style.conversationlist.item.hover);
        }
    };
}

function onhoverout(item) {
    return function(event) {
        if (!item.props.selected) {
            setStyle(event.currentTarget.style, style.conversationlist.item.default);
        }
    };
}

function getColor(id) {
    if (!_.has(avatarColors, id)) {
        _.set(avatarColors, id, generateRandomColor());
    }
    return _.get(avatarColors, id)
}

function generateRandomColor() {
    return '#' + (~~(Math.random() * 0x1000000)).toString(16);
}