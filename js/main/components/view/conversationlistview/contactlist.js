/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var classNames = require('classnames');
var ConversationConstants = require('../../../constants/conversationconstants');
var EventTypes = require('../../../constants/eventtypes');
var globalEmitter = require('../../../events/globalemitter');
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
    mixins: [hoverableMixin, selectableMixin, groupableMixin]
});

//core module to export
module.exports = createGroupClass({
    displayName: 'ContactList',
    getDefaultProps: function () {
        return {onSelect: defaultOnSelect};
    },
    _selectPreviousContact: function() {
        this.selectSibling(-1);
    },
    _selectNextContact: function() {
        this.selectSibling(1);
    },
    componentDidMount: function() {
        globalEmitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        globalEmitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    componentWillUnmount: function() {
        globalEmitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        globalEmitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    preprocessData: function (dataList) {
        return _.groupBy(dataList, function (data) {
            if (data.type === ConversationConstants.PRIVATE_TYPE) {
                return data.name[0];
            }
            return data.type;
        })
    },
    renderTitle: function (data, key) {
        return <h2 className="title">{Lang[key] || key}</h2>;
    },
    renderItem: function (data, key, props) {
        return (
            <div data-conversation-type={data.type} data-item-id={data.id || key} className={classNames('item', {active: this.checkItemSelected(key)})}>
                <Avatar name={data.name} src={data.avatar} index={key} />
                <p className="name">{data.name}<span className="message-last-time">{data.time}</span></p>
                <p className="state">
                    { data.count && (data.count + ' people')
                    || (data.online && 'online' || (data.lastActiveTime + 'h ago'))}
                </p>
            </div>
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
