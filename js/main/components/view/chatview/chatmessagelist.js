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

//core module to export
module.exports = createGroupableClass({
    displayName: 'ChatMessageList',
    getDefaultProps: function() {
        return {intialEnableSelect: false};
    },
    preprocessData: function(data) {
        var now = Number(new Date());
        var deltaTime = 5 * 60 * 1000;
        var deltaDate = 24 * 60 * 60 * 1000;
        var lastGroupTime;
        var lastGroupDate;

        //console.log('data: ', data);

        return _(data)
            .sortBy('time')
            .groupBy(function(message, index, data) {
                // first group by user and minutes
                var lastMessage = data[index - 1];

                //if (lastMessage) {
                //    console.group('checkUser');
                //    console.log('lastUser: ', lastMessage.user._data);
                //    console.log('thisUser: ', message.user._data);
                //    console.log('lastUser == thisUser: ', lastMessage.user == message.user);
                //    console.groupEnd();
                //}


                if (!lastMessage || lastMessage.user !== message.user
                    || message.timestamp - lastMessage.timestamp > deltaTime
                    || message.time.getDate() != lastMessage.time.getDate()) {
                    lastGroupTime = formats.formatTime(message.time);
                }
                return lastGroupTime;
            })
            .groupBy(function(messages, index, data) {
                // then group by date
                var lastMessageTimestamp = data[index - 1] && data[index - 1][0].timestamp;
                var timestamp = messages[0].timestamp;

                if (!lastMessageTimestamp || timestamp - lastMessageTimestamp > deltaDate) {
                    lastGroupDate = now - timestamp < deltaDate
                        ? Lang.today
                        : now - timestamp < 2 * deltaDate
                            ? Lang.yesterday
                            :  messages[0].time.toLocaleDateString();
                }
                return lastGroupDate;
            })
            .value();
    },
    _modifyCurrentChat: function(event) {
        this.setState({
            enableSelect: !!(event && event.modifyEnable),
            selectedKeys: []
        });
    },
    componentDidMount: function() {
        globalEmitter.on(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    compnonentWillUnmount: function() {
        globalEmitter.removeListener(EventTypes.MODIFY_CHAT_MESSAGES, this._modifyCurrentChat);
    },
    renderByDefault: function() {
        return <div className="main" />;
    },
    renderTitle: function(data, key) {
        return <div className="message system"><p>{key}</p></div>;
    },
    renderItem: function(messages, key, props) {
        if (!isValidMessageData(messages)) {
            return null;
        }

        var message = messages[0];

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
                <ChatMessageContents className="contents" data={messages}></ChatMessageContents>
            </div>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data);
}
