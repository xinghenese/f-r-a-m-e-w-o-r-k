/**
 * Created by Administrator on 2015/7/10.
 */

//dependencies
var _ = require('lodash');
var React = require('react');

//private fields


//core module to export
module.exports = {
    displayName: 'DownWalkable',
    walkRefs: function(callback, result) {
        return _.reduce(this.refs, function(memo, element) {
            return callback(memo, element);
        }, result, this);
    },
    render: function(element) {
        var prefix = (this._seq || 'child-');

        var children = markChildren(element, function(child, level) {
          return {
            ref: prefix + level.join('-')
          }
        }, this);

//        var children = markChildren(this, )

        console.log('isMounted: ', this.isMounted());

        return React.cloneElement(element, void 0, children);
    },
    componentDidMount: function() {
      _.forOwn(this.refs, function(element, key) {
        console.group(key + ': ' + getName(element));
        console.log(element);
        console.groupEnd();
      });

        var element = this.refs[this._seq];
        console.group(this._seq + ': ' + getName(element));
        console.log(element);
        console.groupEnd();

    }
};

//module initialization

//private functions
function markChildren(element, callback, thisArg, level) {
  level = level || [];

  console.group(getName(element));
  console.log(element);

  if (!element.props || !element.props.children) {
    console.groupEnd();
    return void 0;
  }

  //if children are not objects, such as text nodes, return them as early
  //as possible, 'cause unnecessary to do the following transverse step,
  //which would probably lead to errors either.
  if (!_.isObject(element.props.children)) {
    console.groupEnd();
    return element.props.children;
  }

  var children = React.Children.map(element.props.children, function(child, key) {
    var currentLevel = _(level).slice(0).push(key).value();

    return React.cloneElement(
      child,
      callback.call(this, child, currentLevel),
      markChildren(child, callback, thisArg, currentLevel)
    )
  }, thisArg || element);

  console.groupEnd();
  return children;
}

function getName(element) {
  if (React.isValidElement(element)) {
    return element.type.displayName || element.type;
  }
  return element.constructor.displayName || element.tagName || 'component';
}