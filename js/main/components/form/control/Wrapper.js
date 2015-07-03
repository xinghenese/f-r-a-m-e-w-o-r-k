/**
 * Created by Administrator on 2015/6/30.
 */

//dependencies
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields

//core module to export
var ControlWrapper = React.createClass({
    render: function() {
      var seq = this.props.seq;
      var i = 0;
      var children = React.Children.map(this.props.children, function(child) {
        var newseq = seq + '-' + (i++);
        return React.cloneElement(child, {
          ref: 'form-control-' + newseq,
          seq: newseq
        });
      });
      return (
        <div style={makeStyle(this.props.style)}>{children}</div>
      )
    }
});

module.exports = ControlWrapper;

//module initialization


//private functions
function getCSSClassPath(className) {
  if (!className) {
    return className;
  }
  return className.replace('-', '.');
}