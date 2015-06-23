/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');

module.exports = function(cssObj){
  if(_.isPlainObject(cssObj)){
    return _.mapValues(cssObj, function(value, key){
      if(!_.isObject(value) && !_.isFunction(value)){
        return value + "";
      }
    })
  }
  return {};
};