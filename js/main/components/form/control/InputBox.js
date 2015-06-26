/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies
var React = require('react');
var style = require('../../../style/common');
var makeStyle = require('../../../style/stylenormalizer');

//private fields


//core module to export
var box = module.exprots = React.createClass({
  render: function(){
    return (
      <input
        style={makeStyle(style.input)}
        autoComplete="off" type="tel"
        onChange={this.props.handleInputChange}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        placeholder={this.props.defaultValue}
      />
    )
  }
});

//module initialization


//private functions
function onInputBlur(event){
  event.target.style.borderBottom = style.login.form.input.borderBottom;
}

function onInputFocus(event){
  event.target.style.borderBottom = style.login.form.inputFocus.borderBottom;
}