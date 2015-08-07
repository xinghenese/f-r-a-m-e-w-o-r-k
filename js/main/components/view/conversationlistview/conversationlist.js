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

var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var selectableMixin = require('../../base/specs/list/selectable');

//private fields
var createListClass = createGenerator({
    mixins: [selectableMixin, listableMixin]
});


//core module to export
module.exports = createListClass({
    displayName: 'ConversationList',
    getDefaultProps: function () {
        return {
            onHoverIn: defaultOnHoverIn,
            onHoverOut: defaultOnHoverOut,
            onSelect: defaultOnSelect,
            className: "chat-message-list",
            style: makeStyle(style.conversationlist)
        }
    },
    _selectPreviousConversation: function () {
        this._onSiblingSelect(-1);
    },
    _selectNextConversation: function () {
        this._onSiblingSelect(1);
    },
    componentDidMount: function () {
        emitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        emitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
    },
    componentWillUnmount: function () {
        emitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        emitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
    },

    renderItem: function (data, props) {
        if (!isValidConversationData(data)) {
            return null;
        }

        var otherData = _.omit(data, ['id', 'type', 'message']);

        return (
            <ConversationListItem
                data-conversation-type={data.type}
                {...otherData}
                {...props}
                >
                {data.message}
            </ConversationListItem>
        );
    }
});

//module initialization


//private functions
function isValidConversationData(data) {
    //TODO: why data.message here can be empty.
    return data && !_.isEmpty(data);// && data.senderName;
}

function defaultOnHoverIn (event) {
    setStyle(
        event.currentTarget.style,
        style.conversationlist.item.hover
    );
}

function defaultOnHoverOut (event) {
    setStyle(
        event.currentTarget.style,
        style.conversationlist.item.default
    );
}

function defaultOnSelect (event) {
    var index = event.selectedId;
    var target = event.currentTarget;
    var type = target.getAttribute('data-conversation-type');

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
    emitter.emit('select', {id: index, type: type});
}
