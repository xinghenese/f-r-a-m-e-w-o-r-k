/**
 * Created by Reco on 2015/6/23.
 */

var commonStyle = require('./common');

//core module to export
module.exports = {
    position: 'absolute',
    width: "700px",
    height: "100%",
    top: '0',
    right: '0',
    // header
    header: {
        background: "#fafafa",
        height: "48px",
        textAlign: "center",
        lineHeight: "48px",
        fontSize: "14px",
        // button
        button: {
            height: "100%",
            background: "transparent",
            color: "#2482cc",
            width: "50px",
            // close button
            close: {
                float: "left"
            },
            modify: {
                float: "right"
            }
        }
    },
    // chattips
    chattips: {
        position: 'absolute',
        width: '40%',
        height: '32px',
        lineHeight: '32px',
        top: '40%',
        left: '30%',
        textAlign: 'center',
        fontSize: '14px',
        background: '#888',
        color: '#fff',
        borderRadius: '4px'
    },
    // footer
    footer: {
        position: "absolute",
        bottom: "0",
        height: "58px",
        width: '100%',
        background: "#fafafa"
    },
    // chatmessagelist
    chatmessagelist: {
        height: "600px",
        padding: "0 32px 0 38px",
        overflowY: "auto",
        listStyle: "none",
        // group
        group: {
            listStyle: "none",
            // title
            title: {
                textAlign: "center",
                paddingTop: "22px",
                time: {
                    width: "137px",
                    lineHeight: "18px",
                    fontSize: "12px",
                    background: "#d5d5d5",
                    color: "#fff",
                    borderRadius: "2em",
                    margin: "0 auto"
                }
            },
            // chatmessage
            item: {
                paddingTop: "22px",
                // system message
                system: {
                    textAlign: "center",
                    message: {
                        lineHeight: "18px",
                        fontSize: "12px",
                        background: "#d5d5d5",
                        color: "#fff",
                        borderRadius: "2em",
                        textAlign: "center",
                        padding: "0 2em",
                        '@mixin': commonStyle.singleLineText
                    }
                },
                // avatar
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
                // messagebody
                messagebody: {
                    fontSize: "14px",
                    margin: "0 82px 0 54px",
                    // messagecontent
                    messagecontent: {
                        color: "#313232"
                    }
                },
                // time
                time: {
                    float: "right",
                    color: "#939393",
                    fontSize: "12px",
                    padding: "0 0 20px 10px"
                },
                // checkbox
                checkbox: {
                    float: "right",
                    width: "24px",
                    height: "24px",
                    marginLeft: "24px",
                    marginTop: "-4px",
                    lineHeight: "24px",
                    textAlign: "center",
                    background: "#b3cadb",
                    color: "#fff",
                    borderRadius: "50%",
                    cursor: "pointer"
                }
            }
        }
    },
    // toolbar
    toolbar: {
        position: "absolute",
        bottom: "0",
        minHeight: "34px",
        background: "#fafafa",
        width: "100%",
        padding: "12px 0",
        // accessory
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
        // button
        button: {
            width: "70px",
            height: "32px",
            background: "#f1f1ee",
            color: "#7c7c7b",
            fontSize: "14px",
            marginLeft: "18px",
            borderRadius: "4px"
        },
        // input
        input: {
            width: "530px"
        },
        // inputFocus
        inputFocus: {
            borderBottom: "2px #499dd9 solid"
        },
        // emoji
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
            // test
            , display: "none"
        },
        // send
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
