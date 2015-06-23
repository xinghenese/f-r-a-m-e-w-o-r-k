/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var style = require('../style/chatmessagetoolbar');
var makeStyle = require('../style/stylenormalizer');

//core module to export
var toolbar = module.exports = React.createClass({
  render: function(){
    return (
      <div
        className="chat-message-toolbar"
        style={makeStyle(style.toolbar)}
      >
        <a
          className="chat-message-toolbar-accessory"
          style={makeStyle(style.toolbar.accessory)}
          onClick={this._toggleAccessory}
        >
          <img className="toolbar-accessory-icon"/>
        </a>
        <a
          className="chat-message-toolbar-send"
          style={makeStyle(style.toolbar.send)}
          onClick={this._onSubmit}
        >
          Send
        </a>
        <a
          className="chat-message-toolbar-emoji"
          style={makeStyle(style.toolbar.emoji)}
          onClick={this._toggleEmoji}
        >
          <img className="toolbar-emoji-icon"/>
        </a>
        <div
          className="chat-message-toolbar-input"
          contentEditable
          style={makeStyle(style.toolbar.input)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        >
        </div>
      </div>
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