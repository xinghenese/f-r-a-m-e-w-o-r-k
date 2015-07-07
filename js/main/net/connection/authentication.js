/**
 * Created by Administrator on 2015/6/17.
 */

//dependencies
var _ = require('lodash');
var hash = require('../crypto/hash.rsa');

//private const fields
var INVALID_SEQUENCE = -1;
var HASH_KEY = "Ml1A&Yx<D5Q8-5gY/KpxrK@z^;O+n[uIpW\"h:JN;dt4/P=:44cy@`Cfn)z^8=eAt";

//private fields
var sequence = INVALID_SEQUENCE;

module.exports = {
  'getSequence': function(){
    return sequence;
  },
  'setSequence': function(value){
    sequence = ~~value;
    return this;
  },
  "nextEncodedSequence": function(){
    if(!this.isAuthenticated()){
      throw new Error("Not authenticated yet!");
    }
    return hash.hashEncode((++ sequence) + "", HASH_KEY);
  },
  'isAuthenticated': function(){
    return sequence !== INVALID_SEQUENCE;
  },
  'isValidSequence': function(value){
    return INVALID_SEQUENCE !== value;
  },
  'validateSequence': function(value){
    if(_.isNumber(value)){
      return this.isValidSequence(value);
    }
    if(_.isString(value)){
      var seq = ~~parseFloat(hash.hashDecode(value, HASH_KEY));
      if(this.isValidSequence(seq)){
        this.setSequence(seq);
        return true;
      }
    }
    return false;
  }
};
