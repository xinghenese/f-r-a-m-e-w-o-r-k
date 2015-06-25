/**
 * Created by Administrator on 2015/6/4.
 */

var React = require('react');
var app = require('../components/app');
//var app = require('../components/chatmessagebox');

var App = React.createFactory(app);
//
React.render(
  App(),
  document.getElementById('content')
);
console.log('init');