/**
 * Created by Administrator on 2015/7/5.
 */

//dependencies
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var Button = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  render: function() {
    return (
      <input
        type="button"
        value={this.props.name || this.props.value}
        style={makeStyle(style.button, theme.button, this.props.style)}
        onClick={this.props.onClick}
      />
    );
  }
});

module.exports = Button;

//module initialization


//private functions
