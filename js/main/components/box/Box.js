/**
 * Created by Administrator on 2015/7/2.
 */

//dependencies
var React = require('react');
var MessageBox = require('./MessageBox');

//private fields
var containerId = 'box-container-' + (new Date());
var container = null;

//core module to export
module.exports = {
  showMessagBox: function() {
    return React.render(<MessagBox/>, getContainer());
  }
};

//module initialization


//private functions
function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.getElementById('body').appendChild(container);
  }
  return container;
}