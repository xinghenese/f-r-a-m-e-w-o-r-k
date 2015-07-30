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
    render: function() {
        var data = this.props.data;

        if (!data || _.isEmpty(data)) {
            return null;
        }

        data = _.indexBy(data, 'id');

        var groups = _.map(data, function(data, key) {
            return (
                <ContactItem
                    key={prefix + key}
                    lastAppearance={data.lastAppearance}
                    contactName={data.name}
                    contactAvatar={data.avatar}
                    index={prefix + key}
                    message={
                        data.count && (data.count + ' people')
                        || (data.online && 'online' || (data.lastActiveTime + 'h ago'))
                    }
                    onSelect={onselect(this)}
                    selected={this.props.selectedIndex == key}
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

//module initialization


//private functions
function onselect(group) {
    return function(event) {

    }
}