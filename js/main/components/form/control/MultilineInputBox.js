/**
 * Created by Administrator on 2015/7/5.
 */

//dependencies
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields

//core module to export
var MultilineInputBox = React.createClass({
  render: function() {
    return (
      <div
        className={this.props.className}
        contentEditable
        placeholder={this.props.defaultValue}
        style={makeStyle(style.textarea, theme.textarea, this.props.style)}
        onChange={this.props.onChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      ></div>
    )
  }
});

module.exports = MultilineInputBox;

//module initialization


//private functions
function onInputBlur(event){
  setStyle(event.target.style, theme.textarea.blur);
}

function onInputFocus(event){
  setStyle(event.target.style, theme.textarea.focus);
}