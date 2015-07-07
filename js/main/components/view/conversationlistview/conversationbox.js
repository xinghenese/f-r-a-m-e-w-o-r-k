/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var React = require('react');
var ConversationList = require('./conversationlist');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
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
              senderName: 'kim0',
              senderAvatar: '',
              message: 'event.data',
              time: (new Date()).toLocaleTimeString()
          }, {
              senderName: 'kim1',
              senderAvatar: '',
              message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
              time: (new Date()).toLocaleTimeString()
          }, {
              senderName: 'kim2',
              senderAvatar: '',
              message: '议文档 上能否写下',
              time: (new Date()).toLocaleTimeString()
          });
          return previousState;
    });
  },
  render: function() {
      return (
          <div className="conversation-list-box" style={makeStyle(style)}>
              <div className="conversation-list-box-header"
                  style={makeStyle(style.header)}>
              </div>
              <ConversationList data={this.state.data}/>
              <div className="conversation-list-box-footer"
                  style={makeStyle(style.footer)}>
              </div>
          </div>
      )
  }
});

module.exports = ConversationBox;

//module initialization


//private functions
