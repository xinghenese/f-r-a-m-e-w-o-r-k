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
    height: "706px",
    borderRight: "1px #eee solid",
    position: "relative",
    //header
    header: {
        background: "#fafafa",
        height: "48px",
        //searchbar
        searchbar: {
            padding: "9px 23px",
            //search
            search: {
                width: "75%",
                height: "29px",
                fontSize: "14px",
                lineHeight: "29px",
                padding: "0 5%"
            },
            settings: {
                float: "right",
                width: "17px",
                height: "17px",
                marginTop: "6px"
            }
        }
    },
    //footer
    footer: {
        position: "absolute",
        background: "#fafafa",
        bottom: "0",
        height: "58px",
        width: "100%",
        //switcher
        switcher: {
            height: "100%",
            option: {
                display: "inline-block",
                width: "50%",
                height: "100%",
                cursor: "pointer"
            },
            //conversation-option
            conversation: {
                inactive: {
                    background: "url(/images/conversation.png) center center no-repeat"
                },
                active: {
                    background: "url(/images/conversation-active.png) center center no-repeat"
                }
            },
            //contacts-option
            contacts: {
                inactive: {
                    background: "url(/images/contact.png) center center no-repeat"
                },
                active: {
                    background: "url(/images/contact-active.png) center center no-repeat"
                }
            }
        }
    },
    body: {
        height: "600px",
        overflowY: "auto"
    },
    //conversationlist
    conversationlist: {
        border: "0",
        //caption
        caption: {
            height: "30px",
            lineHeight: "30px",
            padding: "0 14px",
            color: "#282828",
            background: "#fafafa",
            fontSize: "14px"
        },
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
    },
    gap: {
        height: "40px",
        lineHeight: "40px",
        background: "#ebeef1",
        fontSize: "14px",
        color: "#a2aec1",
        textAlign: "center"
    }
};

//module initialization


//private functions
