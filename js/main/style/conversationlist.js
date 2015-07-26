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
    width: "300px",
    borderRight: "1px #eee solid",
    //header
    header: {
        background: "#fafafa",
        height: "48px",
        //searchbar
        searchbar: {
            padding: "9px 23px",
            //search
            search: {
                width: "90%",
                height: "29px",
                fontSize: "14px",
                lineHeight: "29px",
                padding: "0 5%"
            }
        }
    },
    //footer
    footer: {
        background: "#fafafa",
        height: "58px"
    },
    //conversationlist
    conversationlist: {
        height: "600px",
        border: "0",
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
                marginRight: "14px"
            },
            //title
            title: {
                lineHeight: "1.6em",
                '@mixin': commonStyle.singleLineText
            },
            //info
            info: {
                float: "right",
                color: "#d1d1d1",
                fontSize: "12px",
                height: itemHeight
            },
            //time
            time: {
                lineHeight: "1.8em",
                '@mixin': commonStyle.singleLineText
            },
            //unread
            unread: {
                fontSize: "12px",
                lineHeight: "1.8em",
                color: '#fff',
                background: '#6fc766',
                borderRadius: '3px',
                float: 'right',
                textAlign: 'center',
                width: '40px',
                '@mixin': commonStyle.singleLineText
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
