/**
 * Created by Reco on 2015/6/23.
 */

//core module to export
module.exports = {
  toolbar: {
    accessory: {
      boxSizing: 'border-box',
      float: 'left',
      width: '42px',
      height: '42px',
      overflow: 'hidden',
      marginRight: '15px',
      background: '#499dd9',
      cursor: 'pointer'
    },
    input: {
      boxSizing: 'content-box',
      minHeight: '20px',
      fontSize: '12px',
      lineHeight: '20px',
      wordWrap: 'break-word',
      borderBottom: '1px #d2dbe3 solid',
      margin: '0 124px 0 60px',
      padding: '10px 0'
    },
    inputFocus:{
      borderBottom: '2px #499dd9 solid'
    },
    emoji: {
      boxSizing: 'border-box',
      float: 'right',
      width: '42px',
      height: '42px',
      overflow: 'hidden',
      marginRight: '15px',
      borderRadius: '50%',
      background: '#499dd9',
      cursor: 'pointer'
    },
    send: {
      float: 'right',
      width: '42px',
      lineHeight: '42px',
      overflow: 'hidden',
      marginRight: '15px',
      color: '#499dd9',
      cursor: 'pointer'
    }
  }
};