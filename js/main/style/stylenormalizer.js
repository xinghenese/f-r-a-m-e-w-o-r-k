/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');

module.exports = function(){
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
};