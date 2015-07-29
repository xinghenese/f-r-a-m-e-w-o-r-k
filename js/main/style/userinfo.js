/**
 * Created by Administrator on 2015/7/28.
 */

//dependencies


//private fields


//core module to export
module.exports = {
    position: 'absolute',
    width: "700px",
    height: "100%",
    top: '0',
    right: '0',
    //header
    header: {
        background: "#fafafa",
        height: "48px"
    },
    //body
    body: {
        padding: "38px 60px 0",
        avatarRow: {
            height: "64px",
            lineHeight: "64px",
            marginBottom: "34px",
            fontSize: "14px",
            //avatar
            avatar: {
                width: "64px",
                height: "64px",
                lineHeight: "64px",
                fontSize: "24px",
                marginRight: "18px"
            }
        },
        contentRow: {
            height: "38px",
            lineHeight: "38px",
            margin: "0 12px",
            fontSize: "14px",
            color: "#333",
            borderBottom: "1px solid #ededed",
            //info
            infoText: {
                float: "right",
                color: "#939393",
                fontSize: "14px"
            },
            //infoSwitch
            infoSwitch: {
                float: "right",
                marginTop: "10px"
            }
        },
        logoutButton: {
            width: "156px",
            height: "32px",
            lineHeight: "32px",
            margin: "62px 12px 0 0",
            background: "#fe563b",
            float: "right",
            borderRadius: "4px"
        }
    },
    //footer
    footer: {
        position: "absolute",
        bottom: "0",
        height: "58px",
        width: '100%',
        background: "#fafafa"
    },
};

//module initialization


//private functions
