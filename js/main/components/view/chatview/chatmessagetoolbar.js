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
var globalEmitter = require('../../../events/globalemitter');
var objects = require('../../../utils/objects');

//core module to export
var toolbar = module.exports = React.createClass({
    getInitialState: function() {
        return {
            time: '',
            message: '',
            modifyEnable: false
        }
    },
    _focusTextArea: function() {
        this.refs.form && this.refs.form.refs.textArea.focus();
    },
    _handleInputChange: function(event) {
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
            globalEmitter.emit(EventTypes.SELECT_PREVIOUS_CONVERSATION);
        } else if (event.keyCode === KeyCodes.DOWN) {
            globalEmitter.emit(EventTypes.SELECT_NEXT_CONVERSATION);
        } else if (event.keyCode === KeyCodes.ESCAPE) {
            globalEmitter.emit(EventTypes.ESCAPE_MESSAGE_INPUT);
        }
    },
    _handleTextAreaSubmit: function(event) {
        this.refs.form && this.refs.form.submit(event);
    },
    _handleSubmit: function(event) {
        if (objects.containsValuedProp(event.data, "chat-message-input") &&
            _.trim(event.data["chat-message-input"]).length > 0) {
            this.props.onSubmit(event);
        }
    },
    _showInputToolbar: function() {
        globalEmitter.emit(EventTypes.MODIFY_CHAT_MESSAGES, {modifyEnable: false});
    },
    _showModificationToolbar: function(event) {
        this.setState({modifyEnable: !!(event && event.modifyEnable)});
    },
    componentDidMount: function() {
        globalEmitter.on(EventTypes.MODIFY_CHAT_MESSAGES, this._showModificationToolbar)
        globalEmitter.on(EventTypes.FOCUS_MESSAGE_INPUT, this._focusTextArea);
    },
    componentWillUnmount: function() {
        globalEmitter.removeListener(EventTypes.MODIFY_CHAT_MESSAGES, this._showModificationToolbar)
        globalEmitter.removeListener(EventTypes.FOCUS_MESSAGE_INPUT, this._focusTextArea);
    },
    render: function() {
        var style = this.props.style;

        if (this.state.modifyEnable) {
            return (
                <div className="chat-message-toolbar" style={makeStyle(style)}>
                    <Button
                        value={Lang.deleteMessage}
                        onClick={this.props.deleteHandler}
                        style={style.button}
                        />
                    <Button
                        value={Lang.forwardMessage}
                        onClick={this.props.deleteHandler}
                        style={style.button}
                        />
                    <Button
                        value={Lang.reply}
                        onClick={this.props.deleteHandler}
                        style={style.button}
                        />
                    <Button
                        value={Lang.cancel}
                        onClick={this._showInputToolbar}
                        style={style.send}
                        />
                </div>
            );
        }

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
