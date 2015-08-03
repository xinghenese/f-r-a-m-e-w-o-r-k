/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ContactItem = require('./contactitem');
var style = require('../../../style/conversationlist');
var makeStyle = require('../../../style/styles').makeStyle;

//private fields
var prefix = 'contact-group-';

//core module to export
var ContactGroup = React.createClass({
    _onSelect: function (event) {
        var target = event.currentTarget;

        this.props.onSelect({
            id: target.getAttribute('data-contact-id'),
            type: target.getAttribute('data-contact-type')
        });
    },
    render: function () {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }
        data = _.indexBy(data, 'id');

        var groups = _.map(data, function (data, key) {
            return (
                <ContactItem
                    /* key */
                    key={prefix + key}
                    /* props */
                    lastAppearance={data.lastAppearance}
                    contactName={data.name}
                    contactAvatar={data.avatar}
                    message={
                        data.count && (data.count + ' people')
                        || (data.online && 'online' || (data.lastActiveTime + 'h ago'))
                    }
                    selected={this.props.selectedIndex == key}
                    /* data-*attributes */
                    contactId={key}
                    contactType={this.props.groupType}
                    /* event handler */
                    onSelect={this._onSelect}
                    />
            );
        }, this);

        return (
            <div className="contact-group">
                <div
                    className="contact-group-caption"
                    style={style.conversationlist.caption}
                    >
                    {this.props.groupName}
                </div>
                <ul className="contact-group-body"
                    style={makeStyle(style.conversationlist, this.props.style)}
                    >
                    {groups}
                </ul>
            </div>
        )
    }
});

module.exports = ContactGroup;
