/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var style = require('../style/chatmessagetoolbar');
var makeStyle = require('../style/styles').makeStyle;
var Form = require('./form/Form');
var Button = require('./form/control/Button');
var TextArea = require('./form/control/MultilineInputBox');
var Submit = require('./form/control/Submit');

//core module to export
var toolbar = module.exports = React.createClass({
  getInitialState: function() {
    return {
      time: '',
      message: ''
    }
  },
  _handleInputChange: function(event) {
    this.setState({
      time: new Date(),
      message: event.target.value
    })
  },
  render: function(){
    return (
      <Form
        className="chat-message-toolbar"
        style={style.toolbar}
        onSubmit={function(){console.log('send message')}}
      >
        <Button
          className="chat-message-toolbar-accessory"
          style={style.toolbar.accessory}
          onClick={this._toggleAccessory}
        >
        </Button>
        <Submit
          value="Send"
          className="chat-message-toolbar-send"
          style={style.toolbar.send}
          onClick={this._onSubmit}
        />
        <Button
          className="chat-message-toolbar-emoji"
          style={style.toolbar.emoji}
          onClick={this._toggleEmoji}
        />
        <TextArea
          id="chat-message-input"
          className="chat-message-toolbar-input"
          defaultValue="Write a message ..."
          style={style.toolbar.input}
          onChange={this._handleInputChange}
        />
      </Form>
    )
  }
});

//private functions
function onInputBlur(event){
  event.target.style.borderBottom = style.toolbar.input.borderBottom;
}

function onInputFocus(event){
  event.target.style.borderBottom = style.toolbar.inputFocus.borderBottom;
}