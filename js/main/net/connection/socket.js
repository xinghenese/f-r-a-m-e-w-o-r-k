/**
 * Created by Administrator on 2015/6/3.
 */

//dependencies
var promise = require('../../utils/promise');
var _ = require('lodash');

//private fields
var socket = null;
var socketPromise = null;
var serverInfos = _.shuffle(['192.168.1.66', '192.168.1.67', '192.168.1.68']);
var serverInfoIndex = 0;

module.exports = {
  /**
   * @param data {*}
   * @return Q.Promise
   */
  'send': send
};

//private fields
function send(data){
  console.log(serverInfos);
  return connect(serverInfos[serverInfoIndex ++]).then(function(){
    socket.send(data);
  });
}

function connect(host, port, path, protocol){
  if(!(socket && socketPromise)){
    socketPromise = promise.create(function(resolve, reject){
      var url;

      if(!host){
        reject("invalid host to connect via socket");
        return;
      }

      //shutdown and clear socket
      if(socket){
        socket.close();
      }
      //url assembly
      port = port || '80';
      protocol = protocol || 'ws';
      url = protocol + '://' + host + ':' + port + '/' + path;
      socket = new WebSocket(url);

      getConnection().emit('ready');

      //set handler
      socket.onopen = function(event){
        console.log(event);
        resolve(event);
        getConnection().emit('connect', event);
      };
      socket.onclose = function(event){
        console.log(event);
      };
      socket.onerror = function(event){
        console.log(event);
        reject(event);
      };
      socket.onmessage = function(event){
        console.log(event);
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