/**
 * Created by Reco on 2015/6/23.
 */

//dependencie
var _ = require('lodash');
var React = require('react');
var makeStyle = require('../../../style/styles').makeStyle;
var Form = require('./../../form/Form');
var Button = require('./../../form/control/Button');
var EventTypes = require('../../../constants/eventtypes');
var KeyCodes = require('../../../constants/keycodes');
var TextArea = require('./../../form/control/MultilineInputBox');
var Submit = require('./../../form/control/Submit');
var Lang = require('../../../locales/zh-cn');
var emitter = require('../../../utils/eventemitter');
var objects = require('../../../utils/objects');

//core module to export
var toolbar = module.exports = React.createClass({
    getInitialState: function () {
        return {
            time: '',
            message: ''
        }
    },
    _focusInput: function() {
        this.refs.form.refs.textArea.focus();
    },
    _handleInputChange: function (event) {
        this.setState({
            time: new Date(),
            message: event.target.value
        })
    },
    _handleInputKeyDown: function(event) {
        if (!event || !event.target || !_.isEmpty(event.target.value)) {
            return;
        }

        if (event.keyCode === KeyCodes.UP) {
            emitter.emit(EventTypes.SELECT_PREVIOUS_CONVERSATION);
        } else if (event.keyCode === KeyCodes.DOWN) {
            emitter.emit(EventTypes.SELECT_NEXT_CONVERSATION);
        } else if (event.keyCode === KeyCodes.ESCAPE) {
            emitter.emit(EventTypes.ESCAPE_MESSAGE_INPUT);
        }
    },
    _handleTextAreaSubmit: function (event) {
        this.refs.form.submit(event);
    },
    _handleSubmit: function (event) {
        if (objects.containsValuedProp(event.data, "chat-message-input") &&
            _.trim(event.data["chat-message-input"]).length > 0) {
            this.props.onSubmit(event);
        }
    },
    componentDidMount: function() {
        emitter.on(EventTypes.FOCUS_MESSAGE_INPUT, this._focusInput);
    },
    componentWillUnmount: function() {
        emitter.removeListener(EventTypes.FOCUS_MESSAGE_INPUT, this._focusInput);
    },
    render: function () {
        var style = this.props.style;
        if (!this.props.inputEnabled) {
            return (
                <Button
                    value={Lang.deleteConversation}
                    onClick={this.props.deleteHandler}
                    />
            );
        }
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
                    onKeyDown={this._handleInputKeyDown}
                    onSubmit={this._handleTextAreaSubmit}
                    ref="textArea"
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
