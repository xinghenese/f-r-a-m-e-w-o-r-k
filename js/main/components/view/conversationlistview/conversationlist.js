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

var Avatar = require('../../avatar');
var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var selectableMixin = require('../../base/specs/list/selectable');
var hoverableMixin = require('../../base/specs/list/hoverable');

//private fields
var createListClass = createGenerator({
    mixins: [selectableMixin, hoverableMixin, listableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ConversationList',
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
        var selectItem = React.findDOMNode(this.refs[this.state.selectedKey]);
        //if (!elements.isElementInViewport(selectItem)) {
        //    selectItem.scrollIntoView();
        //}
    },
    renderByDefault: function () {
        return <div {...this.props} />;
    },
    renderTitle: function () {
        return <div className="title"/>;
    },
    renderItem: function (data, key, props) {
        if (!isValidConversationData(data)) {
            return this.renderByDefault();
        }

        return (
            <div data-conversation-type={data.type} data-item-id={data.id || key} className={classNames('item', {active: key == this.state.selectedKey})}>
                <Avatar name={data.senderName} src={data.senderAvatar} index={key}/>
                <p className="name"><span className="message-last-time">{data.time && data.time.toLocaleTimeString()}</span>{data.senderName}</p>
                <p className="state"><span className="message-unread">{data.unreadCount || ''}</span>{data.message}</p>
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

    console.info('selected');

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
