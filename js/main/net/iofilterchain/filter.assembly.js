/**
 * Created by Administrator on 2015/6/4.
 */
define(function(require, exports, module){

  var filter = require('./filter');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var _ = require('lodash');

  module.exports = filter.create({
    'processReadable': function(msg, options){
      var connectionType = options.connectionType;
      var result;
      var data;
      var tag;

      if(connectionType == 'http'){
        result = msg.r;
        data = msg.data;
        tag = '';
      }else if(connectionType == 'socket'){
        result = + _.isEmpty(msg);
        tag = '' + _.keys(msg)[0];
        data = _.get(value, tag);
      }

      return protocolpacket.create({
        'result': result,
        'data': data,
        'tag': tag
      });
    },
    'processWritable': function(msg, options){
      var connectionType = options.connectionType;

      if(protocolpacket.isPrototypeOf(msg)){
        if(connectionType == 'http'){
          return msg.data;
        }else if(connectionType == 'socket'){
          return _.set({}, msg.tag, msg.data);
        }
      }

      return msg;
    }
  });

});