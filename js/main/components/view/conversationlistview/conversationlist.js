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

//private fields
var prefix = 'conversation-list-';
var index = 0;

//core module to export
var ConversationList = React.createClass({
    getInitialState: function() {
        return {selectedIndex: -1};
    },
    render: function() {
        var conversationListItem = null;

        if (this.props.data && !_.isEmpty(this.props.data)) {
            conversationListItem = _.map(this.props.data, function(data, key) {
                if (!isValidConversationData(data)) {
                    return null;
                }
                return (
                    <ConversationListItem
                        key={prefix + index++}
                        time={data.time}
                        senderName={data.senderName}
                        senderAvatar={data.senderAvatar}
                        index={prefix + key}
                        onSelect={onselect(this)}
                        selected={this.state.selectedIndex == key}
                        >
                        {data.message}
                    </ConversationListItem>
                );
            }, this);
        }

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
    return function(event) {
        var index = event.currentTarget.id.replace(/\D/g, '');
        list.setState({selectedIndex: index});
        emitter.emit('select', {
            id: index,
            type: _.get(list.props.data, index).type
        });
    }
}

function isValidConversationData(data) {
    return data && !_.isEmpty(data) && data.senderName && data.message;
}