/**
 * Created by Reco on 2015/6/30.
 */

//dependencies
var React = require('react');
var style = require('../../../style/common');
var theme = require('../../../style/default');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var Submit = React.createClass({
  render: function() {
    return (
      <input
        type="submit"
        value={this.props.name || this.props.value}
        style={makeStyle(style.button, theme.button, this.props.style)}
      />
    );
  }
});

module.exports = Submit;

//module initialization


//private functions
