/**
 * Created by Reco on 2015/6/23.
 */

//core module to export
module.exports = {
    float: "right",
    width: "700px",
    position: "relative",
    //header
    header: {
        background: "#fafafa",
        height: "48px"
    },
    //chatmessagelist
    chatmessagelist: {
        height: "658px",
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
                margin: "0 82px 0 54px",
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
        position: "absolute",
        bottom: "0",
        minHeight: "34px",
        background: "#fafafa",
        width: "100%",
        padding: "12px 0",
        //accessory
        accessory: {
            boxSizing: "border-box",
            float: "left",
            width: "30px",
            height: "30px",
            overflow: "hidden",
            margin: "0 10px 0 26px",
            background: "#4d91c7",
            cursor: "pointer",
            borderRadius: "4px"
        },
        //input
        input: {
            width: "530px"
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
            //test
            ,display:"none"
        },
        //send
        send: {
            float: "right",
            width: "50px",
            lineHeight: "30px",
            margin: "0 26px 0 22px",
            background: "#4d91c7",
            color: "#fff",
            borderRadius: "4px"
        }
    }
};