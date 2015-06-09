/**
 * Created by Administrator on 2015/5/25.
 */

//dependencies
var CryptoJS = require('./core');
var origin = require('./../base/origin');
var _ = require('lodash');

var WordArray = CryptoJS.lib.WordArray;

//core module to export
module.exports = origin.extend({

  toHex: function(){
    return _.reduce(this.bytes, function(accumulator, value){
      value = value.toString(16);
      return accumulator + (value.length < 2 ? '0' + value : value);
    }, '')
  },

  toWords: function(){
    var result = [];
    var bts = this.bytes;
    var old_length = bts.length;
    var new_length = 4 * Math.ceil(old_length / 4);
    var more = old_length % 4;

    if(old_length > 0){
      if(more > 0){
        bts.length = new_length;
        _.fill(bts, 0, old_length);
      }
      for(var i = 0; i < new_length; i += 4){
        result[i/4] = (bts[i] << 24) + (bts[i+1] << 16) + (bts[i+2] << 8) + (bts[i+3]);
      }
    }

    return result;
  },

  toWordArray: function(){
    return WordArray.create(this.toWords());
  },

  init: function(array){
    var result = this.bytes = [];

    if(WordArray.isPrototypeOf(array)){
      array = array.words;

      if(array.length > 0){
        _.forEach(array, function(value, index){
          var i = index * 4;
          var word = array[index];
          result[i] = (word >> 24) & 0xFF;
          result[i+1] = (word >> 16) & 0xFF;
          result[i+2] = (word >> 8) & 0xFF;
          result[i+3] = word & 0xFF;
        });
      }
    }else if(_.isArray(array) && array.length > 0){
      _.forEach(array, function(value, index){
        result[index] = value & 0xFF;
      });
      console.log('result: ', result);
      console.log('result.length: ', result.length);
    }
  }
});