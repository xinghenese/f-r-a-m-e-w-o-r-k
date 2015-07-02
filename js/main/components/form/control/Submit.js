/**
 * Created by Reco on 2015/6/30.
 */

//dependencies
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields


//core module to export
var Submit = React.createClass({
  render: function() {
    return (
      <input
        type="submit"
        value={this.props.value || "submit"}
        style={makeStyle(this.props.style)}
      />
    );
  }
});

module.exports = Submit;

//module initialization


//private functions
