/**
 * Created by Administrator on 2015/6/19.
 */

//dependencies
var React = require('react');

//private fields
var style = {
  message: {

  },
  avatar: {
    float: 'left',
    marginRight: '15px'
  },
  avatarImg: {
    borderRadius: '50%',
    overflow: 'hidden'
  },
  time: {
    float: 'right',
    textAlign: 'right'
  },
  messageBody: {

  },
  messageContent: {

  }
};

//core module to export
var message = React.createClass({
  render: function(){
    return (
      <div className='message' style={style.message}>
        <a className='avatar' style={style.avatar}>
          <img src={this.props.avatar} style={style.avatarImg} width='42' height='42'/>
        </a>
        <div className='time'>{this.props.time} style={style.time}</div>
        <div className='message-body' style={style.messageBody}>
          <a className='user'>{this.props.author} style={style.author}</a>
          <p className='message-content' style={style.messageContent}>
          {this.props.children}
          </p>
        </div>
      </div>
    )
  }
});

//module initialization


//private functions