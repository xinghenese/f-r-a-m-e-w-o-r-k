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
    getDefaultProps: function () {
        return {user: {}};

    },
    render: function () {
        return (
            <div className="main settings">
                <div className="header" />
                <div className="main" >
                    <div className="form-group summary">
                        <Avatar name={this.props.user.name} index={this.props.user.id} src={this.props.user.avatar}/>
                        <span className="name">{this.props.user.name}</span>
                    </div>
                    <div className="form-group options">
                        <div className="option mobile-number" >
                            <span className="control-label">{Lang.mobile}</span>
                            <input className="form-control" type="text" readOnly value={this.props.mobile} />
                        </div>
                        <div className="option control audio">
                            <span className="control-label">{Lang.audioEnable}</span>
                            <SwitchButton className="form-control" />
                        </div>
                        <div className="option control notification">
                            <span className="control-label">{Lang.notificationEnable}</span>
                            <SwitchButton className="form-control" />
                        </div>
                    </div>
                    <div className="form-group sign-out">
                        <button className="sign-out">{Lang.logout}</button>
                    </div>
                </div>
                <div className="footer" />
            </div>
        )
    }
});

module.exports = UserInfoBox;

//module initialization


//private functions
