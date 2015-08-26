/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationActions = require('../../../actions/conversationactions');
var ConversationConstants = require('../../../constants/conversationconstants');
var EventTypes = require('../../../constants/eventtypes');
var elements = require('../../../utils/elements');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var globalEmitter = require('../../../events/globalemitter');
var groups = require('../../../datamodel/groups');
var protocols = require('../../../utils/protocols');

var Avatar = require('../../avatar');
var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var selectableMixin = require('../../base/specs/list/selectable');
var hoverableMixin = require('../../base/specs/list/hoverable');
var fields = require('../../base/specs/list/fields');

//private fields
var DATA_ITEM_ID_FIELD = fields.DATA_ITEM_ID_FIELD;
var createListClass = createGenerator({
    mixins: [selectableMixin, listableMixin, hoverableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ConversationList',
    getDefaultProps: function() {
        return {
            onHoverIn: defaultOnHoverIn,
            onHoverOut: defaultOnHoverOut,
            onSelect: defaultOnSelect,
            className: "conversation-list",
            style: style.conversationlist
        }
    },
    _selectFirstConversation: function() {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            return;
        }

        var first = _.first(this.props.data);
        globalEmitter.emit(EventTypes.SELECT_CONVERSATION, {id: first.id, type: first.type});
    },
    _selectPreviousConversation: function() {
        this._onSiblingSelect(-1);
    },
    _selectNextConversation: function() {
        this._onSiblingSelect(1);
    },
    componentDidMount: function() {
        globalEmitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        globalEmitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
        globalEmitter.on(EventTypes.SELECT_FIRST_CONVERSATION, this._selectFirstConversation);
    },
    componentWillUnmount: function() {
        globalEmitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        globalEmitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
        globalEmitter.removeListener(EventTypes.SELECT_FIRST_CONVERSATION, this._selectFirstConversation);
    },
    componentDidUpdate: function() {
        var selectItem = React.findDOMNode(this.refs[this.state.selectedKey]);
        if (!elements.isElementInViewport(selectItem)) {
            selectItem.scrollIntoView();
        }
    },
    renderItem: function(data, props, key) {
        if (!isValidConversationData(data)) {
            return null;
        }

        var className = props.className || 'conversation-list-item';
        var style = props.style || {};
        var liStyle = (key == this.state.selectedKey) && style.active;

        return (
            <li data-conversation-type={data.type} style={liStyle} ref={key}>
                <Avatar
                    className={className + '-avatar'}
                    /* props */
                    name={data.senderName}
                    src={data.senderAvatar}
                    index={key}
                    /* style */
                    style={style.avatar}
                    />

                <div
                    className={className + '-info'}
                    style={makeStyle(style.info)}
                    >
                    <div
                        className={className + '-time'}
                        style={makeStyle(style.time)}
                        >
                        {data.time}
                    </div>
                    <div
                        className={className + '-unread-count'}
                        style={makeStyle(style.unread)}
                        >
                        {data.unreadCount || 0}
                    </div>
                </div>

                <div className={className + '-body'}>
                    <div
                        className={className + '-nickname'}
                        style={makeStyle(style.title)}
                        >
                        {data.senderName}
                    </div>
                    <p
                        className={className + '-content'}
                        style={makeStyle(style.message)}
                        >
                        {data.message}
                    </p>
                </div>
            </li>
        );
    }
});

//private functions
function isValidConversationData(data) {
    //TODO: why data.message here can be empty.
    return data && !_.isEmpty(data);// && data.senderName;
}

function defaultOnHoverIn(event) {
    setStyle(
        event.currentTarget.style,
        style.conversationlist.item.hover
    );
}

function defaultOnHoverOut(event) {
    setStyle(
        event.currentTarget.style,
        style.conversationlist.item.default
    );
}

function defaultOnSelect(event) {
    var component = event.currentComponent;
    var index = event.selectedId || component.props[DATA_ITEM_ID_FIELD];
    var type = component.props['data-conversation-type'];

    if (type === ConversationConstants.GROUP_TYPE) {
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
    globalEmitter.emit(EventTypes.SELECT_CONVERSATION, {id: index, type: type});
}
