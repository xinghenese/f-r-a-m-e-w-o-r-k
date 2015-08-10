/**
 * Created by Administrator on 2015/7/27.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var ContactGroup = require('./contactgroup');
var EventTypes = require('../../../constants/eventtypes');
var style = require('../../../style/contactlist');
var makeStyle = require('../../../style/styles').makeStyle;
var setStyle = require('../../../style/styles').setStyle;
var emitter = require('../../../utils/eventemitter');
var Lang = require('../../../locales/zh-cn');

var Avatar = require('../../avatar');
var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
var hoverableMixin = require('../../base/specs/list/hoverable');

//private fields
var createGroupClass = createGenerator({
    mixins: [groupableMixin, hoverableMixin]
});

//core module to export
module.exports = createGroupClass({
    displayName: 'ContactList',
    getDefaultProps: function () {
        return {
            onHoverIn: defaultOnHoverIn,
            onHoverOut: defaultOnHoverOut,
            className: "contact-list",
            style: style.contactlist,
            groupBy: this.groupBy
        }
    },
    _selectPreviousContact: function() {
        console.log("selecting previous contact");
    },
    _selectNextContact: function() {
        console.log("selecting previous contact");
    },
    componentDidMount: function() {
        console.log('did mount');
        emitter.on(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.on(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    componentWillUnmount: function() {
        emitter.removeListener(EventTypes.SELECT_PREVIOUS_CONVERSATION, this._selectPreviousContact);
        emitter.removeListener(EventTypes.SELECT_NEXT_CONVERSATION, this._selectNextContact);
    },
    renderGroupTitle: function (data, props, id) {
        return (
            <div
                className={props.className + '-caption'}
                style={props.style.caption}
                >
                {Lang[id] || id}
            </div>
        )
    },
    renderItem: function (data, props, id) {
        var className = props.className;
        var style = props.style;
        return (
            <li >
                <Avatar
                    className={className + '-avatar'}
                    name={data.name}
                    src={data.avatar}
                    index={id}
                    style={style.avatar}
                    />

                <div className={className + '-body'}>
                    <div
                        className={className + '-nickname'}
                        style={makeStyle(style.title)}
                        >
                        {data.name}
                    </div>
                    <p
                        className={className + '-last-appearance'}
                        style={makeStyle(style.message)}
                        >
                        { data.count && (data.count + ' people')
                        || (data.online && 'online' || (data.lastActiveTime + 'h ago'))}
                    </p>
                </div>
            </li>
        )
    },
    groupBy: function (data) {
        if (data.type === 'user') {
            return data.name[0];
        }
        return data.type;
    }
});

//private functions
function defaultOnHoverIn(event) {
    setStyle(
        event.currentTarget.style,
        style.contactlist.group.item.hover
    );
}

function defaultOnHoverOut(event) {
    setStyle(
        event.currentTarget.style,
        style.contactlist.group.item.default
    );
}
