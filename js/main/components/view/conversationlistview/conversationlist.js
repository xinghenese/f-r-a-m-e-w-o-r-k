/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var ConversationActions = require('../../../actions/conversationactions');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var groups = require('../../../datamodel/groups');
var protocols = require('../../../utils/protocols');

//private fields
var prefix = 'conversation-list-';
var index = 0;

//core module to export
var ConversationList = React.createClass({
    getInitialState: function () {
        return {selectedIndex: -1};
    },
    _onSelect: function (event) {
        var target = event.currentTarget;
        var index = target.getAttribute('data-conversation-index');
        var type = target.getAttribute('data-conversation-type');

        this.setState({selectedIndex: index});

        if (type === "group") {
            var group = groups.getGroup(index);
            if (group && group.inGroup()) {
                ConversationActions.joinConversation(
                    protocols.toConversationType(type),
                    index,
                    null
                );
            }
        } else {
            ConversationActions.joinConversation(
                protocols.toConversationType(type),
                null,
                index
            );
        }

        this.props.onSelect({id: index, type: type});

        //emitter.emit('select', {
        //    id: index,
        //    type: type
        //});
    },
    render: function () {
        var conversationList = null;

        if (this.props.data && !_.isEmpty(this.props.data)) {
            conversationList = _.map(this.props.data, function (data, key) {
                if (!isValidConversationData(data)) {
                    return null;
                }
                return (
                    <ConversationListItem
                        /* key */
                        key={prefix + key}
                        /* props */
                        time={data.time}
                        senderName={data.senderName}
                        senderAvatar={data.senderAvatar}
                        selected={this.state.selectedIndex == key}
                        /* data-* attributes */
                        conversationIndex={key}
                        conversationType={data.type}
                        /* event handler */
                        onSelect={this._onSelect}
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
                {conversationList}
            </ul>
        )
    }
});

module.exports = ConversationList;

//module initialization


//private functions
function isValidConversationData(data) {
    //TODO: why data.message here can be empty.
    return data && !_.isEmpty(data);// && data.senderName;
}
