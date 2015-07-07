/**
 * Created by Administrator on 2015/7/6.
 */

//dependencies
var styles = require('./styles');
var commonStyle = require('./common');

//private fields
var itemHeight = "48px";

//core module to export
module.exports = {
  conversationlist: {
    width: "300px",
    height: "1000px",
    border: "1px #eee solid",
    //item
    item: {
      height: itemHeight,
      margin: "0",
      padding: "16px 14px",
      fontSize: "14px",
      cursor: "pointer",
      //active
      active: {
        background: "#4d91c7",
        color: "#fff"
      },
      //hover
      hover: {
        background: "#f2f6fa",
        color: "#000"
      },
      //default
      default: {
        background: "#fff",
        color: "#000"
      },
      //avatar
      avatar: {
        width: itemHeight,
        lineHeight: itemHeight,
        height: itemHeight,
        borderRadius: "50%",
        float: "left",
        background: "#4d91c7",
        textAlign: "center",
        marginRight: "14px",
        overflow: "hidden"
      },
      //title
      title: {
        lineHeight: "1.6em",
        '@mixin': commonStyle.singleLineText
      },
      //time
      time: {
        float: "right",
        color: "#d1d1d1",
        fontSize: "12px",
        height: itemHeight
      },
      //message
      message: {
        color: "#939393",
        fontSize: "12px",
        lineHeight: "1.8em",
        '@mixin': commonStyle.singleLineText
      }
    }
  }
};

//module initialization


//private functions
