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
var SELECT_REF_FIELD = 'selected';

//core module to export
var ContactGroup = React.createClass({
    getDefaultProps: function () {
        return {selectedIndex: -1};
    },
    _onSelect: function (event, offset) {
        var lastSelectedItem = React.findDOMNode(this.refs[SELECT_REF_FIELD]);
        var target = event && event.currentTarget || lastSelectedItem;

        offset = Number(offset) || 0;
        if (offset > 0) {
            target = target && target.nextSibling;
        } else if (offset < 0) {
            target = target && target.previousSibling;
        }

        if (!target || target === lastSelectedItem) {
            return;
        }

        this.props.onSelect({
            itemId: target.getAttribute('data-contact-id'),
            groupId: this.props.index,
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
            var item = (
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

            if (this.props.selectedIndex == key) {
                item = React.cloneElement(item, {ref: SELECT_REF_FIELD});
            }
            return item;

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
