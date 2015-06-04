/**
 * Created by Administrator on 2015/6/3.
 */
define(function(require, exports, module){

  //dependencies
  var q = require('q');

  //private fields
  var socket = null;
  var socketPromise = null;

  module.exports = {
    /**
     * @param data {*}
     * @return Q.Promise
     */
    'send': send
  };

  //private fields
  function send(data){
    return connect().then(function(){
      socket.send(data);
    });
  }

  function connect(host, port, protocol){
    if(!(socket && socketPromise)){
      socketPromise = q.Promise(function(resolve, reject){
        var url;

        //shutdown and clear socket
        if(socket){
          socket.close();
        }
        //url assembly
        port = port || '80';
        protocol = protocol || 'ws';
        url = protocol + '//' + host + ':' + port;
        socket = new WebSocket(url);

        getConnection().emit('ready');

        //set handler
        socket.onopen = function(event){
          resolve(event);
          getConnection().emit('connect', event);
        };
        socket.onclose = function(event){

        };
        socket.onerror = function(event){
          reject(event);
        };
        socket.onmessage = function(event){
          getConnection().emit('message', event.data);
        };
      });
    }
    return socketPromise;
  }

  function getConnection(){
    var connection = require('./socketconnection');
    if(!connection){
      throw new Error('socketconnection not initialized yet');
    }
    return connection;
  }

});