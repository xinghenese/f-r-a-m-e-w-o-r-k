/**
 * Created by Administrator on 2015/5/28.
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('./../base/origin');
  var _ = require('lodash');

  //core module to export
  module.exports = origin.extend({
    'process': function(processor, context){
      if(_.isFunction(processor)){
        var args = _.toArray(arguments).slice(2);
        args.unshift(this._value);
        this._value = processor.apply(context || this, args);
      }
      return this;
    },
    'get': function(key){
      key = this._value && this._value[key];
      if(_.isUndefined(key)){
        return this;
      }
      if(_.isFunction(key)){
        return key.apply(this._value);
      }
      return key;
    },
    'init': function(value){
      var args = _.toArray(arguments).slice(1);
      this._value = _.isFunction(value) ? value.apply(this, args) : value;
    },
    'done': function(){
      return this._value;
    },
    'report': function(tag){
      tag = tag || 'value';
      console.log(tag + ': ', this._value);
      return this;
    },
    'valueOf': function(){
      return this._value;
    }
  }, ['get', 'process', 'done', 'init', 'report', 'valueOf']);

});