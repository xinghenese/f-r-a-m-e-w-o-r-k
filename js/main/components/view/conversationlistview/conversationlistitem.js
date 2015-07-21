/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var React = require('react');
//var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields


//core module to export
var ConversationListItem = React.createClass({
    render: function() {
        var itemStyle = this.props.style || {};
        var currentStyle = itemStyle.default;

        if (this.props.selected) {
            currentStyle = itemStyle.active;
        }

        return (
          <li className="conversation-list-item"
              id={this.props.index}
              style={makeStyle(itemStyle, currentStyle)}
              onClick={this.props.onSelect}
              onMouseEnter={onhoverin(this)}
              onMouseLeave={onhoverout(this)}>
              <a
                  className="conversation-list-item-avatar"
                  style={makeStyle(itemStyle.avatar)}
              >
                <img
                    alt={this.props.senderName}
                    src={this.props.senderAvatar}
                    width="100%"
                    height="100%"
                />
              </a>
              <div
                  className="conversation-list-item-time"
                  style={makeStyle(itemStyle.time)}
              >
                  {this.props.time}
              </div>
              <div className="conversation-list-item-body">
                  <div className="conversation-list-item-nickname"
                  style={makeStyle(itemStyle.title)}>
                      {this.props.senderName}
                  </div>
                  <p className="conversation-list-item-content"
                      style={makeStyle(itemStyle.message)}>
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
            setStyle(event.currentTarget.style, item.props.style.hover);
        }
    };
}

function onhoverout(item) {
    return function(event) {
        if (!item.props.selected) {
            setStyle(event.currentTarget.style, item.props.style.default);
        }
    };
}