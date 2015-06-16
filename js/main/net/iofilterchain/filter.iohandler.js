/**
 * Created by Administrator on 2015/5/29.
 */

//dependencies
var _ = require('lodash');
var filter = require('./filter');

//core module to export
module.exports = filter.create({
  'processReadable': function(msg, options){
    var connectionType = options.connectionType;
    var result;
    var data;
    var tag;

    if(connectionType == 'http'){
      result = + msg.r;
      data = msg.data;
    }else if(connectionType == 'socket'){
      result = + _.isEmpty(msg);
      tag = '' + _.keys(msg)[0];
      data = {
        'tag': tag,
        'data': _.get(msg, tag)
      };
    }

    //should extend the logic here to handle various invalid results.
    if(result != 0){
      throw new Error('invalid result valued ' + result);
    }
    //in case of something wrong with response data.
    if(!data){
      throw new Error('empty data');
    }
    notify(msg);

    console.log('data: ', data);

    return data;
  }
});

//private functions
function notify(msg){
  console.log('notify with ', msg);
}