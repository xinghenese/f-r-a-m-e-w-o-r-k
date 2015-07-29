/**
 * Created by Administrator on 2015/7/28.
 */

//dependencies
var _ = require('lodash');
var React = require('react');
var style = require('../../../style/userinfo');
var makeStyle = require('../../../style/styles').makeStyle;
var Avatar = require('../../avatar');
var SwitchButton = require('../../tools/SwitchButton');
var Button = require('../../form/control/Button');
var Lang = require('../../../locales/zh-cn');

//private fields


//core module to export
var UserInfoBox = React.createClass({
    propTypes: {
        onLogout: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {user: {}};

    },
    render: function() {
        return (
            <div className="user-info-box" style={makeStyle(style)}>
                <div className="user-info-box-header" style={makeStyle(style.header)} />
                <div className="user-info-box-body" style={makeStyle(style.body)}>
                    <div className="user-info-avatar" style={makeStyle(style.body.avatarRow)}>
                        <Avatar
                            name={this.props.user.name || 'hello'}
                            index={this.props.user.id || 3234}
                            src={this.props.user.avatar}
                            style={makeStyle(style.body.avatarRow.avatar)}
                        />
                        <span>{this.props.user.name || 'hello'}</span>
                    </div>
                    <div className="user-info-content">
                        <div className="user-info-mobile" style={makeStyle(style.body.contentRow)}>
                            <span>{Lang.mobile}</span>
                            <span style={makeStyle(style.body.contentRow.infoText)}>
                                {this.props.mobile || '153-3333-3333'}
                            </span>
                        </div>
                        <div className="user-info-audio-enable" style={makeStyle(style.body.contentRow)}>
                            <span>{Lang.audioEnable}</span>
                            <SwitchButton style={makeStyle(style.body.contentRow.infoSwitch)} />
                        </div>
                        <div className="user-info-notification-enable" style={makeStyle(style.body.contentRow)}>
                            <span>{Lang.notificationEnable}</span>
                            <SwitchButton style={makeStyle(style.body.contentRow.infoSwitch)} />
                        </div>
                        <Button
                            className="user-info-log-out-button"
                            value={Lang.logout}
                            style={style.body.logoutButton}
                            onClick={this.props.onLogout}
                        />
                    </div>
                </div>
                <div className="user-info-box-footer" style={makeStyle(style.footer)} />
            </div>
        )
    }
});

module.exports = UserInfoBox;

//module initialization


//private functions
