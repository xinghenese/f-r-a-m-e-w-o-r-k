/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ContactGroup = require('./contactgroup');
var EventTypes = require('../../../constants/eventtypes');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var Lang = require('../../../locales/zh-cn');

//private fields
var prefix = 'contact-list-';

//core module to export
var ContactList = React.createClass({
    getInitialState: function() {
        return {selectedIndex: -1};
    },
    _onSelect: function(data) {
        this.setState({selectedIndex: data.id});
        emitter.emit('select', {
            id: data.id,
            type: data.type
        });
    },
    _selectPreviousContact: function() {
        console.log("selecting previous contact");
    },
    _selectNextContact: function() {
        console.log("selecting previous contact");
    },
    componentDidMount: function() {
        emitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    componentWillUnmount: function() {
        emitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    render: function() {
        var data = this.props.data;
        if (!data || _.isEmpty(data)) {
            return null;
        }

        data = _.groupBy(data, function(data) {
            if (data.type === 'user') {
                return data.name[0];
            }
            return data.type;
        });

        var contactList = _.map(data, function(data, key) {
            var groupType = key !== 'group' ? 'user' : key;
            return (
                <ContactGroup
                    /* key */
                    key={prefix + key}
                    /* props */
                    index={key}
                    data={data}
                    groupName={Lang[key] || key}
                    selectedIndex={this.state.selectedIndex}
                    /* data-* attributes */
                    groupType={groupType}
                    /* event handler */
                    onSelect={this._onSelect}
                    />
            );
        }, this);

        contactList = _.sortBy(contactList, function(contactGroup) {
            var groupName = contactGroup.props.index;
            if (groupName === 'group') {
                return 0;
            }
            if (groupName === 'contact') {
                return 1;
            }
            return String(groupName).charCodeAt(0);
        });

        return (
            <ul className="contact-list"
                style={makeStyle(style.conversationlist, this.props.style)}
                >
                {contactList}
            </ul>
        )
    }
});

module.exports = ContactList;
