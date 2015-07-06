/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var Lang = require('../../../locales/zh-cn');
var ChatMessageList = require('./chatmessagelist');
var ChatMessageToolbar = require('./chatmessagetoolbar');
var InputBox = require('./../../form/control/InputBox');

var Wrapper = require('./../../form/control/Wrapper');
var Form = require('./../../form/Form');
var RequiredValidator = require('./../../form/validator/RequiredFieldValidator');
var Submit = require('./../../form/control/Submit');

var style = require('../../../style/login');
var makeStyle = require('../../../style/styles').makeStyle;
var RegExpValidator = require('./../../form/validator/RegularExpressionValidator');
var RequiredFieldValidator = require('./../../form/validator/RequiredFieldValidator');

//core module to export
var ChatMessageBox = React.createClass({
  getInitialState: function(){
    return {
      data: []
    };
  },
  _handleSubmit: function(event) {
    console.log('event.data: ', event.data);
    this.setState(function(previousState) {
      previousState.data.push({
        senderName: 'reco',
        senderAvatar: '',
        message: event.data,
        time: +new Date()
      });
      return previousState;
    });
  },
  componentWillMount: function() {
    this.setState(function(previousState) {
      previousState.data.push({
        senderName: 'xinghenese',
        senderAvatar: '',
        message: 'event.data',
        time: +new Date()
      }, {
        senderName: 'kim',
        senderAvatar: '',
        message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
        time: +new Date()
      });
      return previousState;
    });
  },
  render: function(){
    return (
      <div className="chat-message-box">
        <ChatMessageList data={this.state.data}/>
        <ChatMessageToolbar onSubmit={this._handleSubmit}/>
      </div>
    );
  }
});

module.exports = ChatMessageBox;