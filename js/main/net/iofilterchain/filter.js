/**
 * Created by Administrator on 2015/5/28.
 *
 * adapter of filter
 * final props: [read, write]
 * adapted props: [processRead, processWrite, notifyConfig, enableRead, enableWrite]
 */
define(function(require, exports, module){

  //dependencies
  var origin = require('../base/origin');
  var q = require('q');

  //core module to export
  module.exports = origin.extend({
    /**
     * a final method used to read data from the connection and process it.
     * @param value {Object|String}
     * @returns {Object|String}
     */
    'read': function(value){
      if(this.enableRead){
        return this.processReadable(value);
      }
      return value;
    },
    /**
     * a final method used to write processed data to the connection.
     * @param value {Object|String}
     * @returns {Object|String}
     */
    'write': function(value){
      if(this.enableWrite){
        return this.processWritable(value);
      }
      return value;
    },
    /**
     * would be overridden to extend the processing logic.
     * @param value
     * @returns {*}
     */
    'processReadable': function(value){
      return value;
    },
    /**
     * would be overridden to extend the processing logic.
     * @param value
     * @returns {*}
     */
    'processWritable': function(value){
      return value;
    },
    /**
     * config the filter to specify whether to process the data which is
     * read from the connection or ready to write to the connection. and
     * some other settings as well.
     * @param cfg
     */
    'notifyConfig': function(cfg){

    },
    /**
     * whether to process the data
     */
    'enableRead': true,
    /**
     * whether to process the data
     */
    'enableWrite': true
  }, ['read', 'write']);

});