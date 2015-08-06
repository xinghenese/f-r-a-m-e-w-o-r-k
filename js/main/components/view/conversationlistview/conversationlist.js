/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationListItem = require('./conversationlistitem');
var ConversationActions = require('../../../actions/conversationactions');
var EventTypes = require('../../../constants/eventtypes');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var groups = require('../../../datamodel/groups');
var protocols = require('../../../utils/protocols');

//private fields
var prefix = 'conversation-list-';
var index = 0;
var SELECT_REF_FIELD = 'selected';

//core module to export
var ConversationList = React.createClass({
    getInitialState: function () {
        return {selectedIndex: -1};
    },
    _onSelect: function (event, offset) {
        var lastSelectedItem = React.findDOMNode(this.refs[SELECT_REF_FIELD]);
        var target = event && event.currentTarget || lastSelectedItem;

        offset = Number(offset) || 0;
        if (offset > 0) {
            target = target && target.nextSibling;
        } else if (offset < 0) {
            target = target && target.previousSibling;
        }

        if (!target || target === lastSelectedItem) {
            return;
        }

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
    },
    _selectPreviousConversation: function () {
        this._onSelect(null, -1);
    },
    _selectNextConversation: function () {
        this._onSelect(null, 1);
    },
    componentDidMount: function () {
        emitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        emitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
    },
    componentWillUnmount: function () {
        emitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        emitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
    },
    render: function () {
        var data = this.props.data;
        if (!data || _.isEmpty(data)) {
            return null;
        }

        var conversationList = _.map(data, function (data) {
            if (!isValidConversationData(data)) {
                return null;
            }
            var item = (
                <ConversationListItem
                    /* key */
                    key={prefix + data.id}
                    /* props */
                    time={data.time}
                    senderName={data.senderName}
                    senderAvatar={data.senderAvatar}
                    selected={this.state.selectedIndex == data.id}
                    /* data-* attributes */
                    conversationIndex={data.id}
                    conversationType={data.type}
                    /* event handler */
                    onSelect={this._onSelect}
                    onKeyPress={this._onKeyPress}
                    >
                    {data.message}
                </ConversationListItem>
            );

            if (this.state.selectedIndex == data.id) {
                item = React.cloneElement(item, {ref: SELECT_REF_FIELD});
            }
            return item;

        }, this);

        return (
            <ul className="chat-message-list"
                style={makeStyle(style.conversationlist, this.props.style)}
                >
                {conversationList}
            </ul>
        );
    }
});

module.exports = ConversationList;

//module initialization


//private functions
function isValidConversationData(data) {
    //TODO: why data.message here can be empty.
    return data && !_.isEmpty(data);// && data.senderName;
}
