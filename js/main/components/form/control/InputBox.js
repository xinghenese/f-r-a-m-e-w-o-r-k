/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields


//core module to export
var InputBox = React.createClass({
  render: function(){
    return (
      <input
        id={this.props.id}
        style={makeStyle(style.input, theme.input, this.props.style)}
        className={this.props.className}
        autoComplete="off" type="tel"
        onChange={this.props.onChange}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        placeholder={this.props.defaultValue}
        value={this.props.initialValue}
      />
    )
  }
});

module.exports = InputBox;

//module initialization


//private functions
function onInputBlur(event){
  setStyle(event.target.style, theme.input.blur);
}

function onInputFocus(event){
  setStyle(event.target.style, theme.input.focus);
}