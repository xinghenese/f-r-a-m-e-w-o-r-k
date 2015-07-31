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

        data = _.groupBy(data, function (data) {
                if (data.type === 'user') {
                    return data.name[0];
                }
                return data.type;
            });

        var contactList = _.map(data, function (data, key) {
            return (
                <ContactGroup
                    key={prefix + key}
                    index={prefix + key}
                    data={data}
                    groupName={Lang[key] || key}
                    selectedIndex={this.state.selectedIndex}
                    />
            );
        }, this);

        contactList = _.sortBy(contactList, function(contactGroup) {
            var groupName = contactGroup.props.index.replace(prefix, '');
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
