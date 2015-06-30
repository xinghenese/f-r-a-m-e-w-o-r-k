/**
 * Created by Administrator on 2015/6/23.
 */

//dependencies


//private fields
var os = void 0;

//core module to export

module.exports = {
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