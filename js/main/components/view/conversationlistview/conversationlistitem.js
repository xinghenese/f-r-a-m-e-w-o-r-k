/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var React = require('react');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var ConversationListItem = React.createClass({
    render: function() {
        return (
          <li className="conversation-list-item" style={makeStyle(style.conversationlist.item)}>
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
                  <div className="conversation-list-item-nickname" >
                      {this.props.senderName}
                  </div>
                  <p className="conversation-list-item-content">
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
