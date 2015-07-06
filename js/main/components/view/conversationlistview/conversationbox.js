/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var React = require('react');
var ConversationList = require('./conversationlist');
//var store = require('../../../stores/conversationliststore');

//private fields


//core module to export
var ConversationBox = React.createClass({
  getInitialState: function(){
    return {
      data: []
    };
  },
  componentWillMount: function() {
//    var self = this;
//    store.fetch('conversationList').then(function(data) {
//      self.setState({data: data});
//    });
    this.setState(function(previousState) {
        previousState.data.push({
          senderName: 'xinghenese',
          senderAvatar: '',
          message: 'event.data',
          time: (new Date()).toLocaleTimeString()
        }, {
          senderName: 'kim',
          senderAvatar: '',
          message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
          time: (new Date()).toLocaleTimeString()
        });
        return previousState;
    });
  },
  render: function() {
    return (
      <div className="conversation-list-box">
        <ConversationList data={this.state.data}/>
      </div>
    )
  }
});

module.exports = ConversationBox;

//module initialization


//private functions
