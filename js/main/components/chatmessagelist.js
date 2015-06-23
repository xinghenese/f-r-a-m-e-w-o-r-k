/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ChatMessage = require('./chatmessage');

//core module to export
var messagelist = module.exports = React.createClass({
  render: function(){
    var chatMessageNodes = _.map(this.props.data, function(data){
      return (
        <ChatMessage time={data.time} senderName={data.senderName} senderAvatar={data.senderAvatar}>
          {data.message}
        </ChatMessage>
      );
    });
    return (
      <div className="chat-message-list">
        {chatMessageNodes}
      </div>
    )
  }
});