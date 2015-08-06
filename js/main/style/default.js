/**
 * Created by Administrator on 2015/6/25.
 */

//dependencies


//private fields
var COLOR_DIM = "#e6e6e6";
var COLOR_LIGHT = "#6cace1";

//core module to export
module.exports = {
    input: {
        borderBottom: "1px solid " + COLOR_DIM,
        blur: {
            borderBottom: "1px solid " + COLOR_DIM
        },
        focus: {
            borderBottom: "1px solid " + COLOR_LIGHT
        }
    },
    search: {
        blur: {
            outline: "0 none"
        },
        focus: {
            outline: "1px solid " + COLOR_LIGHT
        }
    },
    textarea: {
        width: "200px",
        fontSize: "12px",
        lineHeight: "20px",
        wrapper: {
            padding: "5px 0 5px 5px",
            outline: "1px #ececec solid",
            background: "#fff"
        }
    },
    button: {
        background: COLOR_LIGHT,
        color: "#fff"
    },
    errorText: {
        color: "#D45A58"
    },
    mask: {
        background: "#818181"
    },
    messagebox: {
        width: "348px",
        height: "192px",
        background: "#fff",
        color: "#282828",
        textAlign: "center",
        fontSize: "14px",
        button: {
            float: "right",
            color: "#4c83b5",
            margin: "0 32px 22px 0"
        }
    },
    avatar: {
        float: 'left',
        color: '#fff'
    },
    switchButton: {
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        cursor: "pointer",
        bullet: {
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fff",
            on: {
                float: 'right'
            },
            off: {
                float: 'left'
            }
        },
        on: {
            background: "#4bd763",
            border: "1px solid #4bd763"
        },
        off: {
            background: "#d7d7d7",
            border: "1px solid #d7d7d7"
        }
    }
};

//module initialization


//private functions
