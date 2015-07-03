/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//core module to export
module.exports = {
  makeStyle: makeStyle,
  setStyle: setStyle
};

//private functions
function makeStyle() {
  return _.reduce(_.toArray(arguments), function(result, arg){
    if(_.isPlainObject(arg)){
      return _.assign(result, _.mapValues(arg, function(value){
        if(!_.isObject(value) && !_.isFunction(value)){
          return value + "";
        }
      }))
    }
    return result;
  }, {});
}

function setStyle(targetStyle, sourceStyle) {
  _.forOwn(makeStyle(sourceStyle), function(value, key) {
    _.set(targetStyle, key, value);
  });
}

function coverStyle(component, style) {
  if (!_.isPlainObject(style)
    || !component
    || !component.props
    || !component.props.children) {
    return;
  }
  React.Children.forEach(component.props.children, function(child) {
    var className = child.props.className;

  });
}