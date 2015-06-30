/**
 * Created by Administrator on 2015/6/30.
 */

//dependencies
var React = require('react');

//private fields

//core module to export
var ControlWrapper = React.createClass({
    render: function() {
      var seq = this.props.seq;
      var i = 0;
      var children = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {
          ref: 'form-control-' + seq + '-' + (i++)
        });
      });
      return (
        <div>{children}</div>
      )
    }
});

module.exports = ControlWrapper;

//module initialization


//private functions
