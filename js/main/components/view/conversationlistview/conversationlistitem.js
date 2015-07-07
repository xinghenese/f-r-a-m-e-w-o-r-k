/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var React = require('react');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields


//core module to export
var ConversationListItem = React.createClass({
    render: function() {
        return (
          <li className="conversation-list-item"
              id={this.props.index}
              style={makeStyle(style.conversationlist.item)}
              onClick={this.props.onClick}
              onMouseEnter={onhoverin}
              onMouseLeave={onhoverout}>
              <a
                  className="conversation-list-item-avatar"
                  style={makeStyle(style.conversationlist.item.avatar)}
              >
                <img
                    alt={this.props.senderName}
                    src={this.props.senderAvatar}
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
function onfocus(event) {
  setStyle(event.currentTarget.style, style.conversationlist.item.active);
}

function onblur(event) {
  setStyle(event.currentTarget.style, style.conversationlist.item.default);
}

function onhoverin(event) {
  setStyle(event.currentTarget.style, style.conversationlist.item.hover);
}

function onhoverout(event) {
  setStyle(event.currentTarget.style, style.conversationlist.item.default);
}