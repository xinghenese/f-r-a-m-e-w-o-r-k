/**
 * Created by Reco on 2015/6/30.
 */

//dependencies
var React = require('react');

//private fields


//core module to export
var Submit = React.createClass({
  render: function() {
    return (
      <input
        type="submit"
        value={this.props.value || "submit"}
      />
    );
  }
});

module.exports = Submit;

//module initialization


//private functions
