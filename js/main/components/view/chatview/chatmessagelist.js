/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var Lang = require('../../../locales/zh-cn');
var globalEmitter = require('../../../events/globalemitter');
var EventTypes = require('../../../constants/eventtypes');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var multiselectableMixin = require('../../base/specs/list/multiselectable');
var Avatar = require('../../avatar');
var messageConstants = require('../../../constants/messageconstants');
var SystemMessage = require('./systemmessage');
var ChatMessageContents = require('./chatmessagecontents');
var formats = require('../../../utils/formats');

//private fields
var createGroupableClass = createGenerator({
    mixins: [multiselectableMixin, groupableMixin]
});
var now = new Date();

//core module to export
module.exports = createGroupableClass({
    displayName: 'ChatMessageList',
    getDefaultProps: function () {
        return {intialEnableSelect: false};
    },
    preprocessData: function (data) {
        return _.groupBy(data, function (message) {
            var time = new Date(message.timestamp);
            if (time.getFullYear() !== now.getFullYear() || time.getMonth() !== now.getMonth()) {
                return time.toDateString();
            }
            if (time.getDate() === now.getDate()) {
                return Lang.today;
            }
            if (time.getDate() + 1 === now.getDate()) {
                return Lang.yesterday;
            }
            return time.toDateString();
        })
    },
    _modifyCurrentChat: function (event) {
        this.setState({
            enableSelect: !!(event && event.modifyEnable),
            selectedKeys: []
        });
    },
    componentDidMount: function () {
        globalEmitter.on(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    compnonentWillUnmount: function () {
        globalEmitter.removeListener(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    renderByDefault: function () {
        return <div className="main" />;
    },
    renderTitle: function (data, key) {
        return <div className="message system"><p>{key}</p></div>;
    },
    renderItem: function (message, key, props) {
        if (!isValidMessageData(message)) {
            return null;
        }

        if (message.type == messageConstants.MessageTypes.SYSTEM) {
            return (
                <div className="message system">
                    <SystemMessage data={message}/>
                </div>
            )
        }

        return (
            <div className="message">
                <Avatar name={message.user.nickname()} src={message.user.picture()} index={message.user.getUserId()}/>
                <div className="status">
                    <a className="sender-name">{message.user.nickname()}</a>
                    <span className="sender-time">{formats.formatTime(message.timestamp)}</span>
                </div>
                <ChatMessageContents className="contents" data={message}></ChatMessageContents>
            </div>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.user && data.user.nickname();
}
