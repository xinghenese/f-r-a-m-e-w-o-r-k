/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var ConversationList = React.createClass({
  render: function() {
    var conversationListItem = _.map(this.props.data, function(data){
      return (
        <ConversationListItem time={data.time} senderName={data.senderName} senderAvatar={data.senderAvatar}>
          {data.message}
        </ConversationListItem>
      );
    });
    return (
      <ul className="chat-message-list"
        style={makeStyle(style.conversationlist, this.props.style)}>
        {conversationListItem}
      </ul>
      )
  }
});

module.exports = ConversationList;

//module initialization


//private functions
