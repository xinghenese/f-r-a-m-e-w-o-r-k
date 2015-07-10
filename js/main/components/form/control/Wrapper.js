/**
 * Created by Administrator on 2015/6/30.
 */

//dependencies
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var createDownWalkableClass = require('../../base/creator/createDownWalkableClass');

//private fields

//core module to export
module.exports = createDownWalkableClass({
    displayName: 'ControlWrapper',
    render: function() {
      return (
        <div style={makeStyle(this.props.style)}>{this.props.children}</div>
      )
    }
});

//module initialization


//private functions
function getCSSClassPath(className) {
  if (!className) {
    return className;
  }
  return className.replace('-', '.');
}