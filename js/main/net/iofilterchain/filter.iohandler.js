/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var filter = require('./filter');
  var processible = require('../cipher/processible');
  var factory = require('../cipher/factory');
  var keyExchange = factory.createKeyExchange();
  var codec = factory.createCodec();
  var _ = require('lodash');
  var protocolpacket = require('../protocolpacket/protocolpacket');
  var connectionProto = require('../connection/connection');

  //private const fields
  var PUBLICK_KEY_FIELD = 'pk';

  //core module to export
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
        data = _.get(msg, tag);
      }

      //should extend the logic here to handle various invalid results.
      if(result != 0){
        throw new Error('invalid result');
      }
      //in case of something wrong with response data.
      if(!data){
        throw new Error('empty data');
      }
      notify(msg);

      return {
        'tag': tag,
        'data': data
      };
    }
  });

  //private functions

  function getConnection(tag){
    var connection;

    switch(tag){
      case 'http':
        connection = require('../connection/httpconnection');
        break;
      case 'socket':
        connection = require('../connection/socketconnection');
        break;
      default:
        connection = null;
    }
    if(!connection){
      throw new Error('connection module not initialized yet');
    }

    return connection;
  }

  function notify(msg){
    console.log('notify with ', msg);
  }

});