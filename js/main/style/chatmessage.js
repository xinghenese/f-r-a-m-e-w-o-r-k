/**
 * Created by Reco on 2015/6/23.
 */

//core module to export
module.exports = {
    float: "right",
    width: "700px",
    //header
    header: {
        background: "#fafafa",
        height: "48px"
    },
    //chatmessagelist
    chatmessagelist: {
        height: "600px",
        padding: "0 32px 0 38px",
        //chatmessage
        chatmessage: {
            paddingTop: "22px",
            //avatar
            avatar: {
                boxSizing: "border-box",
                float: "left",
                width: "36px",
                height: "36px",
                lineHeight: "36px",
                overflow: "hidden",
                marginRight: "18px",
                background: "#499dd9",
                cursor: "pointer",
                borderRadius: "50%"
            },
            //messagebody
            messagebody: {
                fontSize: "14px",
                //messagecontent
                messagecontent: {
                    color: "#313232"
                }
            },
            //time
            time: {
                float: "right",
                color: "#939393",
                fontSize: "12px",
                padding: "0 0 20px 10px"
            }
      }
    },
    //toolbar
    toolbar: {
        height: "58px",
        background: "#fafafa",
        //accessory
        accessory: {
            boxSizing: "border-box",
            float: "left",
            width: "42px",
            height: "42px",
            overflow: "hidden",
            marginRight: "15px",
            background: "#499dd9",
            cursor: "pointer"
        },
        //input
        input: {
            boxSizing: "content-box",
            minHeight: "20px",
            fontSize: "12px",
            lineHeight: "20px",
            wordWrap: "break-word",
            border: "0",
            outline: "0",
            borderBottom: "1px #d2dbe3 solid",
            margin: "0 124px 0 60px",
            padding: "10px 0"
        },
        //inputFocus
        inputFocus:{
            borderBottom: "2px #499dd9 solid"
        },
        //emoji
        emoji: {
            boxSizing: "border-box",
            float: "right",
            width: "42px",
            height: "42px",
            overflow: "hidden",
            marginRight: "15px",
            borderRadius: "50%",
            background: "#499dd9",
            cursor: "pointer"
        },
        //send
        send: {
            float: "right",
            width: "50px",
            lineHeight: "30px",
            margin: "12px 15px 0 0",
            background: "#4d91c7",
            color: "#fff"
        }
    }
};