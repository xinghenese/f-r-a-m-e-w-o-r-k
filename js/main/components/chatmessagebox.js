/**
 * Created by Reco on 2015/6/23.
 */

//dependencies
var React = require('react');
var ChatMessageList = require('./chatmessagelist');
var ChatMessageToolbar = require('./chatmessagetoolbar');
var InputBox = require('./form/control/InputBox');

var Wrapper = require('./form/control/Wrapper');
var Form = require('./form/form');
var RequiredFieldValidator = require('./form/validator/RequiredFieldValidator');
var Submit = require('./form/control/Submit');

//core module to export
var messagebox = module.exports = React.createClass({
  getInitialState: function(){
    return {
      data: [{
        senderName: 'kim',
        senderAvatar: '',
        message: 'ok，3Q &lt;br/&gt; HTTP API 协议文档 上能否写下',
        time: +new Date()
      }]
    };
  },
  render: function(){
    return (
      <div className="chat-message-box">
        <ChatMessageList data={this.state.data}/>
        <ChatMessageToolbar/>
        <InputBox defaultValue="default"/>
        <Form handleSubmit={function(){console.log('submit success!');}}>
           <Wrapper>
             <RequiredFieldValidator
              defaultMessage="PassWord"
              errorMessage="Empty Password!!"
              successMessage="Password Inputted"
              controlToValidate="password"
            />
            <InputBox id="password" defaultValue="password"/>
           </Wrapper>
          <Submit />
        </Form>
      </div>
    );
  }
});