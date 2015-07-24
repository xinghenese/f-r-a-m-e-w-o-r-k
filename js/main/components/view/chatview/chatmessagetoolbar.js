/**
 * Created by Reco on 2015/6/23.
 */

//dependencie
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var Form = require('./../../form/Form');
var Button = require('./../../form/control/Button');
var TextArea = require('./../../form/control/MultilineInputBox');
var Submit = require('./../../form/control/Submit');
var Lang = require('../../../locales/zh-cn');
var objects = require('../../../utils/objects');

//core module to export
var toolbar = module.exports = React.createClass({
    getInitialState: function() {
        return {
            time: '',
            message: ''
        }
    },
    _handleInputChange: function(event) {
        this.setState({
            time: new Date(),
            message: event.target.value
        })
    },
    _handleTextAreaSubmit: function(event) {
        this.refs.form.submit(event);
    },
    _handleSubmit: function(event) {
        if (objects.containsValuedProp(event.data, "chat-message-input") &&
            _.trim(event.data["chat-message-input"]).length > 0) {
            this.props.onSubmit(event);
        }
    },
    render: function() {
        var style = this.props.style;
        return (
            <Form
                className="chat-message-toolbar"
                style={style}
                onSubmit={this._handleSubmit}
                ref="form"
                >
                <Button
                    value={Lang.accessory}
                    className="chat-message-toolbar-accessory"
                    style={style.accessory}
                    onClick={this._toggleAccessory}
                    >
                </Button>
                <Submit
                    value={Lang.send}
                    className="chat-message-toolbar-send"
                    style={style.send}
                    />
                <Button
                    className="chat-message-toolbar-emoji"
                    style={style.emoji}
                    onClick={this._toggleEmoji}
                    />
                <TextArea
                    id="chat-message-input"
                    className="chat-message-toolbar-input"
                    defaultValue={Lang.chatMessageInputTips}
                    style={style.input}
                    onSubmit={this._handleTextAreaSubmit}
                    >
                    <div className="dev"/>
                </TextArea>
            </Form>
        );
    }
});

//private functions
function onInputBlur(event) {
    event.target.style.borderBottom = style.toolbar.input.borderBottom;
}

function onInputFocus(event) {
    event.target.style.borderBottom = style.toolbar.inputFocus.borderBottom;
}