/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ConversationConstants = require('../../../constants/conversationconstants');
var EventTypes = require('../../../constants/eventtypes');
var style = require('../../../style/contactlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var Lang = require('../../../locales/zh-cn');

var groups = require('../../../datamodel/groups');
var ConversationActions = require('../../../actions/conversationactions');
var protocols = require('../../../utils/protocols');

var Avatar = require('../../avatar');
var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var hoverableMixin = require('../../base/specs/list/hoverable');
var selectableMixin = require('../../base/specs/list/selectable');

//private fields
var createGroupClass = createGenerator({
    mixins: [groupableMixin, selectableMixin, hoverableMixin]
});

//core module to export
module.exports = createGroupClass({
    displayName: 'ContactList',
    getDefaultProps: function () {
        return {
            onHoverIn: defaultOnHoverIn,
            onHoverOut: defaultOnHoverOut,
            onSelect: defaultOnSelect,
            className: "contact-list",
            style: style.contactlist,
            groupBy: this.groupBy
        }
    },
    _selectPreviousContact: function() {
        this._onSiblingSelect(-1);
    },
    _selectNextContact: function() {
        this._onSiblingSelect(1);
    },
    componentDidMount: function() {
        emitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    componentWillUnmount: function() {
        emitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    renderGroupTitle: function (data, props, key) {
        return (
            <div
                className={props.className + '-caption'}
                style={props.style.caption}
                >
                {Lang[key] || key}
            </div>
        )
    },
    renderItem: function (data, props, key) {
        var className = props.className;
        var style = props.style;
        var liStyle = (key == this.state.selectedKey) && style.active;

        return (
            <li data-conversation-type={data.type} style={liStyle}>
                <Avatar
                    className={className + '-avatar'}
                    name={data.name}
                    src={data.avatar}
                    index={key}
                    style={style.avatar}
                    />

                <div className={className + '-body'}>
                    <div
                        className={className + '-nickname'}
                        style={makeStyle(style.title)}
                        >
                        {data.name}
                    </div>
                    <p
                        className={className + '-last-appearance'}
                        style={makeStyle(style.message)}
                        >
                        { data.count && (data.count + ' people')
                        || (data.online && 'online' || (data.lastActiveTime + 'h ago'))}
                    </p>
                </div>
            </li>
        )
    },
    groupBy: function (data) {
        if (data.type === ConversationConstants.PRIVATE_TYPE) {
            return data.name[0];
        }
        return data.type;
    }
});

//private functions
function defaultOnHoverIn(event) {
    setStyle(
        event.currentTarget.style,
        style.contactlist.group.item.hover
    );
}

function defaultOnHoverOut(event) {
    setStyle(
        event.currentTarget.style,
        style.contactlist.group.item.default
    );
}

function defaultOnSelect(event) {
    var index = event.selectedId;
    var component = event.currentComponent;
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
    emitter.emit(EventTypes.SELECT_CONVERSATION, {id: index, type: type});
}
