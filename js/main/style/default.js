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
    textarea: {
        minHeight: "20px",
        fontSize: "12px",
        lineHeight: "20px",
        borderBottom: "1px solid" + COLOR_DIM,
        margin: "0 124px 0 60px",
        padding: "10px 0",
        blur: {
            borderBottom: "1px solid " + COLOR_DIM
        },
        focus: {
            borderBottom: "2px solid" + COLOR_LIGHT
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
  }
};

//module initialization


//private functions
