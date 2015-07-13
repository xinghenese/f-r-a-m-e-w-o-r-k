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
var emitter = require('../../../utils/eventemitter');

var store = require('../../../stores/ConversationAndUserStore');

//private fields
var prefix = 'conversation-list-';
var seq = 0;
var messagesCollection = _.get(store, 'ConversationStore');

//core module to export
var ConversationList = React.createClass({
  getInitialState: function() {
      return {selectedKey: '', queryResult: this.props.initialData};
  },
    componentWillMount: function() {
        var self = this;
        _.forEach(this.props.controllers, function(controller) {
            emitter.on(controller, function(data) {
                self.setState({queryResult: data});
            });
        });

    },
  render: function() {
    var conversationListItem = _.map(this.state.queryResult, function(data, key){
        return (
            <ConversationListItem
                time={data.time}
                senderName={data.senderName}
                senderAvatar={data.senderAvatar}
                index={prefix + key}
                onSelect={onselect(this)}
                selected={this.state.selectedKey == key}
            >
                {data.message}
            </ConversationListItem>
        );
    }, this);
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
function onselect(list) {
    return function (event) {
        var selectedKey = event.currentTarget.id.replace(prefix, '');
        list.setState({selectedKey: selectedKey});
        emitter.emit(
            list.constructor.displayName.toLowerCase(),
            _.get(messagesCollection, selectedKey)
        );
    }
}