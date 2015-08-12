/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var commonStyle = require('../../../style/common');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var listableMixin = require('../../base/specs/list/listable');
var Avatar = require('../../avatar');

//private fields
var createListClass = createGenerator({
    mixins: [listableMixin]
});

//core module to export
module.exports = createListClass({
    displayName: 'ChatMessageList',
    renderItem: function (data, props, key) {
        if (!isValidMessageData(data)) {
            return null;
        }
        var className = props.className || 'chat-message';
        var style = props.style || {};

        return (
            <li>
                <Avatar
                    className={className + '-avatar'}
                    style={makeStyle(style.avatar)}
                    name={data.senderName}
                    src={data.senderAvatar}
                    index={key}
                    />

                <div
                    className={className + '-time'}
                    style={makeStyle(style.time)}
                    >
                    {data.time}
                </div>
                <div
                    className={className + '-body'}
                    style={makeStyle(commonStyle.message, style.messagebody)}
                    >
                    <div className={className + '-nickname'}>
                        {data.senderName}
                    </div>
                    <p
                        className={className + '-content'}
                        style={makeStyle(style.messagebody.messagecontent)}
                        >
                        {data.message}
                    </p>
                </div>
            </li>
        )
    }
});

//private function
function isValidMessageData(data) {
    return data && !_.isEmpty(data) && data.senderName && data.message;
}
