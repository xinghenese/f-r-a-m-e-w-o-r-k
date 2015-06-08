/**
 * Created by Administrator on 2015/5/29.
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('../base/origin');
  var q = require('q');
  var _ = require('lodash');

  //core module to export
  module.exports = origin.extend({
    /**
     * HTTP GET
     * @param url
     * @returns {Q.Promise}
     */
    'get': function(url){
      return request("GET", url, void 0);
    },
    /**
     * HTTP POST
     * @param url
     * @param data
     * @returns {Q.Promise}
     */
    'post': function(url, data){
      return request("POST", url, data);
    }
  });

  //private functions
  function request(method, url, data){
    return q.Promise(function(resolve, reject, progress){
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            var res = xhr.responseText;
            if(!res){
              reject('response invalid');
              return;
            }
            resolve(res);
            xhr = null;
          }else{
            reject('http failed');
          }
        }else if(xhr.readyState == 3){
//            progress(xhr.response)
        }
      };

      xhr.open(method, url);
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//      xhr.setRequestHeader("Content-type","text/plain");
      console.log(data);

      xhr.send(data);
    });
  }

});