/**
 * Created by Administrator on 2015/5/28.
 *
 * adapter of filter
 * final props: [read, write]
 * adapted props: [processRead, processWrite, notifyConfig, enableRead, enableWrite]
 */

//dependencies
var origin = require('../base/origin');

//core module to export
module.exports = origin.extend({
  /**
   * a final method used to read data from the connection and process it.
   * @param value {Object|String}
   * @param options {Object}
   * @returns {Object|String}
   */
  'read': function(value, options){
    if(!value){
      throw new Error('empty data when reading');
    }
    if(this.enableRead && options){
      return this.processReadable(value, options);
    }
    return value;
  },
  /**
   * a final method used to write processed data to the connection.
   * @param value {Object|String}
   * @param options {Object}
   * @returns {Object|String}
   */
  'write': function(value, options){
    if(!value){
      throw new Error('empty data when writing');
    }
    if(this.enableWrite && options){
      return this.processWritable(value, options);
    }
    return value;
  },
  /**
   * would be overridden to extend the processing logic.
   * @param value
   * @param options {Object}
   * @returns {*}
   */
  'processReadable': function(value, options){
    return value;
  },
  /**
   * would be overridden to extend the processing logic.
   * @param value
   * @param options {Object}
   * @returns {*}
   */
  'processWritable': function(value, options){
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