/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var ConversationActions = require('../../../actions/conversationactions');
var ConversationConstants = require('../../../constants/conversationconstants');
var EventTypes = require('../../../constants/eventtypes');
var elements = require('../../../utils/elements');
var globalEmitter = require('../../../events/globalemitter');
var groups = require('../../../datamodel/groups');
var protocols = require('../../../utils/protocols');
var Lang = require('../../../locales/zh-cn');

var Avatar = require('../../avatar');
var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var selectableMixin = require('../../base/specs/list/selectable');
var hoverableMixin = require('../../base/specs/list/hoverable');
var formats = require('../../../utils/formats');

var style = require('../../../style/conversationlist');

//private fields
//var prefix = {privateType: 'p-', groupType: 'g-'};
var createListClass = createGenerator({
    mixins: [selectableMixin, hoverableMixin, groupableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ConversationOrContactList',
    getDefaultProps: function () {
        return {onSelect: defaultOnSelect};
    },
    _selectFirstConversation: function () {
        if (!this.props.data || _.isEmpty(this.props.data)) {
            return;
        }

        var first = _.first(this.props.data);
        globalEmitter.emit(EventTypes.SELECT_CONVERSATION, {id: first.id, type: first.type});
    },
    _selectPreviousConversation: function () {
        this.selectSibling(-1);
    },
    _selectNextConversation: function () {
        this.selectSibling(1);
    },
    componentDidMount: function () {
        globalEmitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        globalEmitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
        globalEmitter.on(EventTypes.SELECT_FIRST_CONVERSATION, this._selectFirstConversation);
    },
    componentWillUnmount: function () {
        globalEmitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousConversation);
        globalEmitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextConversation);
        globalEmitter.removeListener(EventTypes.SELECT_FIRST_CONVERSATION, this._selectFirstConversation);
    },
    componentDidUpdate: function() {
        var selectedItem = this.getSelectedItem();
        if (selectedItem && !elements.isElementInViewport(selectedItem)) {
            selectedItem.scrollIntoView();
        }
    },
    preprocessData: function (dataList) {
        if (!dataList || _.isEmpty(dataList)) {
            return null;
        }

        console.log('ConversationList#dataList: ', dataList);

        if (this.props.isContacts && !_.isEmpty(dataList.data)) {
            return _.groupBy(dataList.data, function (data) {
                if (data.type === ConversationConstants.PRIVATE_TYPE) {
                    //data.id = prefix.privateType + data.id;
                    return data.name[0];
                }
                //data.id = prefix.groupType + data.id;
                return data.type;
            })
        }
        return dataList;
    },
    renderByDefault: function () {
        return <div {...this.props} />;
    },
    renderTitle: function (data, key) {
        if (key === 'messages' && data  && !_.isEmpty(data)) {
            return (
                <div className="matched-messages-gap" style={style.gap}>
                    found {_.size(data)} messages
                </div>
            );
        }
        if (key !== 'data' && data && !_.isEmpty(data)) {
            return <h2 className="title">{Lang[key] || key}</h2>;
        }
        return null;
    },
    renderItem: function (data, key) {
        if (!isValidConversationData(data)) {
            return this.renderByDefault();
        }

        return (
            <div data-conversation-type={data.type} data-item-id={data.id || key} className={classNames('item', {active: key == this.state.selectedKey})}>
                <Avatar name={data.name} src={data.senderAvatar} index={key}/>
                <p className="name">
                    <span className="message-last-time">{data.time && formats.formatTime(data.time)}</span>
                    <span title={data.name}>{data.name}</span>
                </p>
                <p className="state">
                    <span className="message-unread">{data.unreadCount || ''}</span>
                    <span title={data.message}>
                        {this.props.isContacts
                            ? data.count && (data.count + ' people') || (data.online && 'online' || (data.lastActiveTime + 'h ago'))
                            : data.message}
                    </span>
                </p>
            </div>
        );
    }
});

//module initialization


//private functions
function isValidConversationData(data) {
    //TODO: why data.message here can be empty.
    return data && !_.isEmpty(data);// && data.senderName;
}

function defaultOnSelect(event) {
    var component = event.currentComponent;
    var index = component.props['data-item-id'];
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
