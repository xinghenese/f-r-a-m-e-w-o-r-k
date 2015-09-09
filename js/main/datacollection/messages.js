/**
 * Created by Administrator on 2015/9/9.
 */
'use strict';

var collection = require('./collection');
var message = require('./messages');

module.exports = collection.extend({
    model: message
});
