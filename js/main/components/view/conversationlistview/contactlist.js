/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ContactGroup = require('./contactgroup');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var Lang = require('../../../locales/zh-cn');

//private fields
var prefix = 'contact-list-';

//core module to export
var ContactList = React.createClass({
    getInitialState: function () {
        return {selectedIndex: -1};
    },
    render: function () {
        var data = this.props.data;
        if (!data || _.isEmpty(data)) {
            return null;
        }

        data = _.groupBy(data, function (item) {
            if (item.type === 'user') {
                return item.name[0];
            }
            return item.type;
        });

        var contactList = _.map(data, function (item, key) {
            return (
                <ContactGroup
                    key={prefix + key}
                    index={prefix + key}
                    data={item}
                    groupName={Lang[key] || key}
                    selected={this.state.selectedIndex === key}
                    onSelect={onSelect(this)}
                    />
            );
        }, this);

        return (
            <ul className="contact-list"
                style={makeStyle(style.conversationlist, this.props.style)}
                >
                {contactList}
            </ul>
        );
    }
});

module.exports = ContactList;

// private functions
function onSelect(list) {
    return function(event) {
        console.log(event);
        var index = event.currentTarget.id.replace(/\D/g, '');
        var type = _.get(list.props.data, index).type;
        list.setState({selectedIndex: index});
        if (type === "group") {
            var group = groups.getGroup(index);
            if (group) {
                if (group.inGroup()) {
                    ConversationActions.joinConversation(protocols.toConversationType(type), index, null);
                }
            }
        } else {
            ConversationActions.joinConversation(protocols.toConversationType(type), null, index);
        }
        emitter.emit('select', {
            id: index,
            type: type
        });
    };
}
