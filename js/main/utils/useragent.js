/**
 * Created by Administrator on 2015/6/23.
 */

//dependencies


//private fields
var os = void 0;

//core module to export

module.exports = {
    getDeviceInfo: detectDeviceInfo,
    getOS: detectOS
};

//module initialization

//private functions
function detectOS() {
    var userAgent = navigator.userAgent;
    var platform = navigator.platform;

    switch (true) {
        case (platform === "Win32") || (platform === "Windows"):
            return "windows";
        case (platform === "Mac68K") || (platform === "MacPPC") || (platform === "Macintosh") || (platform === "MacIntel"):
            return "mac";
        case platform === "X11":
            return "unix";
        case /windows ce/i.test(userAgent):
            return "windows ce";
        case /ipad/i.test(userAgent):
            return "ipad";
        case /iphone os/i.test(userAgent):
            return "ios";
        case /android/i.test(userAgent):
            return "android";
        case /windows mobile/i.test(userAgent):
            return "windows mobile";
        case /linux/i.test(platform):
            return "linux";
        default:
            return "unknown";
    }
}

function detectDeviceInfo() {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
            return 'Opera ' + tem[1];
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
}