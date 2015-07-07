/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;

//private fields
var prefix = 'conversation-list-';
var seq = 0;

//core module to export
var ConversationList = React.createClass({
  seletedIndex: -1,
  componentWillMount: function() {
    this.seq = prefix;
  },
  render: function() {
    var self = this;
    var conversationListItem = _.map(this.props.data, function(data, key){
      return (
        <ConversationListItem
            time={data.time}
            senderName={data.senderName}
            senderAvatar={data.senderAvatar}
            index={self.seq + 'item-' + key}
            ref={key}
            onClick={onclick(this)}
        >
            {data.message}
        </ConversationListItem>
      );
    });
    return (
      <ul className="chat-message-list"
          style={makeStyle(style.conversationlist, this.props.style)}
      >
          {conversationListItem}
      </ul>
      )
  }
});

module.exports = ConversationList;

//module initialization


//private functions
function onclick(list) {
  return function (event) {
    var target = event.currentTarget;

    var previousIndex = list.selectedIndex;

    console.log('event.target: ', target);

    console.log('preivous-selectedIndex: ', list.selectedIndex);
    if (target.tagName.toLowerCase() === 'li') {
      console.log('target: ', target);
      list.selectedIndex = + target.id.replace(/\D/g, '');
      console.log('current-selectedIndex: ', list.selectedIndex);
      if (previousIndex > -1) {
        var previous = React.findDOMNode(_.get(list.refs, previousIndex));
        setStyle(previous.style, style.conversationlist.item.default);
      }
      setStyle(target.style, style.conversationlist.item.active);
    }
  }
}

function onblur(event) {
  var target = event.target;
  if (event.target.tagName.toLowerCase() === 'li') {
    setStyle(target.style, style.conversationlist.item.default);
  }
}

function onhoverin(event) {
  var target = event.target;
  if (event.target.tagName.toLowerCase() === 'li') {
    setStyle(target.style, style.conversationlist.item.hover);
  }
}

function onhoverout(event) {
  var target = event.target;
  if (event.target.tagName.toLowerCase() === 'li') {
    setStyle(target.style, style.conversationlist.item.default);
  }
}