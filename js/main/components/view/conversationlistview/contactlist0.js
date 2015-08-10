/**
 * Created by Reco on 2015/8/10.
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
var Avatar = require('../../avatar');

var createGenerator = require('../../base/creator/createReactClassGenerator');
var groupableMixin = require('../../base/specs/list/groupable');
//var selectableMixin = require('../../base/specs/list/selectable');

//private fields
var createGroupClass = createGenerator({
    mixins: [groupableMixin]
});

//core module to export
module.exports = createGroupClass({
    displayName: 'ContactList',
    getDefaultProps: function () {
        return {
            className: "contact-list",
            style: style.conversationlist,
            groupBy: this.groupBy
        }
    },
    componentDidMount: function() {
        console.log('did mount');
    },
    componentWillUnmount: function() {

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

//module initialization


//private functions
