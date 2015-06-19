/**
 * Created by Administrator on 2015/6/19.
 */

//dependencies
var React = require('react');

//private fields
var style = {

}

//core module to export
var list = module.exports = React.createClass({
  getInitialState: function(){
    return {
      messages: []
    };
  },
  render: function(){
    return (
      <div className='messagelist'>
        {this.state.messages.map(function(message){
          return (
            <Message author={message.author} avatar={message.avatar} time={message.time}>
              {message.content}
            </Message>
          )
        })}
      </div>
    );
  }
});

//module initialization


//private functions