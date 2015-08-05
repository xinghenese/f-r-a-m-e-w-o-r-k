/**
 * Created by Administrator on 2015/6/23.
 */

//dependencies


//private fields


//core module to export
module.exports = {
    //login-form
    login: {
        margin: "-80px auto 90px",
        width: "270px",
        height: "310px",
        border: "1px solid #e6e6e6",
        padding: "44px 65px 36px",
        background: "#fff",
        borderRadius: "6px",
        //head
        head: {
            height: "74px"
        },
        form: {
            //countryName
            countryName: {
                height: "50px",
                margin: "0 0 24px"
            },
            countryCode: {
                float: "left",
                width: "32px",
                background: "none repeat scroll 0 0 #FFFFFF",
                border: "0 none",
                boxShadow: "none",
                color: "#000",
                display: "inline-block",
                fontSize: "13px",
                outline: "0 none",
                resize: "none"
            },
            phoneNumber: {
                marginLeft: "36px",
                background: "none repeat scroll 0 0 #FFFFFF",
                border: "0 none",
                boxShadow: "none",
                color: "#000",
                display: "inline-block",
                fontSize: "13px",
                outline: "0 none",
                resize: "none",
                float: "right",
                width: "200px"
            },
            submit: {},
            title: {
                fontSize: "20px",
                color: "#1d1d1d",
                margin: "0px"
            },
            p: {
                color: "#b5b5b5",
                fontSize: "13px",
                margin: "12px 0 48px"
            },
            label: {
                color: "#999",
                cursor: "pointer",
                display: "block",
                fontSize: "13px",
                fontWeight: "400"
            },
            input: {
                background: "none repeat scroll 0 0 #FFFFFF",
                border: "0 none",
                boxShadow: "none",
                color: "#1d1d1d",
                display: "inline-block",
                fontSize: "13px",
                padding: "10px 0 4px",
                outline: "0 none",
                borderBottom: "1px solid #e6e6e6",
                resize: "none",
                width: "100%",
                //country
                country: {
                    cursor: "pointer"
                }
            },
            button: {
                border: "0px",
                background: "#6cace1",
                color: "#fff",
                height: "47px",
                width: "100%",
                marginTop: "35px",
                borderRadius: "4px",
                cursor: "pointer"
            },
            inputFocus: {
                borderBottom: "1px solid #6cace1"
            }
        },
        codeForm: {
            textAlign: "center",
            reset: {
                color: "#6cace1",
                lineHeight: "2.5"
            },
            notice: {
                color: "#999",
                lineHeight: "2",
                margin: "20px 0 40px"
            },
            commonText: {
                fontSize: "13px",
                textAlign: "center"
            },
            submit: {
                marginTop: "42px"
            }
        },
        pointer: {
            cursor: "pointer"
        }
    },

    //country-form
    country: {
        margin: "-80px auto 90px",
        width: "306px",
        height: "324px",
        border: "1px solid #e6e6e6",
        padding: "32px 49px",
        background: "#fff",
        borderRadius: "6px",
        //title
        title: {
            marginBottom: "16px",
            fontSize: "20px",
            textAlign: "center",
            color: "#282828"
        },
        //search
        search: {
            height: "32px",
            background: "#f2f2f2",
            color: "#bebebe",
            textAlign: "center"
        },
        //wrapper
        wrapper: {
            height: "236px",
            marginTop: "12px",
            overflowY: "auto",
            background: "#f2f2f2",
            //countrylist
            countrylist: {
                listStyle: "none",
                countryItem: {
                    borderBottom: "1px #e6e6e6 solid",
                    padding: "14px 20px 0 30px",
                    lineHeight: "26px",
                    cursor: "pointer",
                    //countryName
                    countryName: {
                        fontSize: "14px",
                        color: "#3e3e3e"
                    },
                    //countryCode
                    countryCode: {
                        fontSize: "14px",
                        color: "#282828",
                        float: "right"
                    }
                }
            }
        }
    }
};

//module initialization


//private functions
