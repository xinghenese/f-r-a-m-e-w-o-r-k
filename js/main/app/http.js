/**
 * Created by Administrator on 2015/6/1.
 */
require.config({
  shim: {
    jsbn2: {
      deps: ['jsbn'],
      exports: 'BigInteger'
    },
    'enc-base64': {
      deps: ['core'],
      exports: 'CryptoJS.enc.Base64'
    },
    "mode-ecb":{
      deps: ['core', 'cipher-core']
    },
    md5: {
      deps: ['core']
    },
    evpkdf: {
      deps: ['md5']
    },
    'cipher-core': {
      deps: ['core', 'enc-base64', 'evpkdf']
    },
    aes: {
      deps: ['core', 'enc-base64', 'evpkdf', 'cipher-core', 'mode-ecb', 'md5'],
      exports: 'CryptoJS.AES'
    }
  },
  paths: {
    core: '../../lib/cryptojslib/components/core',
    aes: '../../lib/cryptojslib/components/aes',
    md5: '../../lib/cryptojslib/components/md5',
    'cipher-core': '../../lib/cryptojslib/components/cipher-core',
    evpkdf: '../../lib/cryptojslib/components/evpkdf',
    'enc-base64': '../../lib/cryptojslib/components/enc-base64',
    'mode-ecb': '../../lib/cryptojslib/components/mode-ecb',
    jsbn: '../../lib/jsbn/jsbn',
    jsbn2: '../../lib/jsbn/jsbn2',
    react: '../../lib/react/react',
    requirejs: '../../lib/requirejs/require',
    lodash: '../../lib/lodash/lodash',
    q: '../../lib/q/q',
    'gzip-js': '../../lib/gzip-js/lib/gzip',
    crc32: "../../lib/gzip-js/node_modules/crc32/lib/crc32",
    "deflate-js": "../../lib/gzip-js/node_modules/deflate-js/index",
    rawinflate: "../../lib/gzip-js/node_modules/deflate-js/lib/rawinflate",
    rawdeflate: "../../lib/gzip-js/node_modules/deflate-js/lib/rawdeflate"
  },
  packages: [

  ]
});

define('test', function(require, exports, module){

  var connection = require('../net/connection/httpconnection');
  var factory = require('../net/cipher/factory');
  var processible = require('../net/cipher/processible');
  var keyExchange = factory.createKeyExchange();
  var codec = factory.createCodec();
  var crypto = factory.createCrypto();
  var protocolpacket = require('../net/protocolpacket/protocolpacket');

  connection
    .disableConfig()
//    .post("auth/c", packet)
    .request(protocolpacket.create({
      'url': "auth/c",
      'data': {
        'pk': keyExchange.getPublicKey()
      }
    }))
    .catch(function(err){
      console.error(err);
    })
    .then(function(value){
      console.log(value);
//      console.log(connection);
//      console.log(connection.resetConfig()._cfg);
      connection.resetConfig().post("usr/lg", {
        mid: '18616371916',
        c: 1122,
        pf: 1,
        os: 'PC',
        dv: '1',
        di: '1122334455',
        uuid: '7e9d-501c-dbd816078039'
      })
    })
//    .then(function(value){
//      console.log('then');
//      console.log(value);
//
//      var loginInfo = {
//        mid: '18616371916',
//        c: 1122,
//        pf: 1,
//        os: 'PC',
//        dv: '1',
//        di: '1122334455',
//        uuid: '7e9d-501c-dbd816078039'
//      };
//      console.log('value: ', value.toString(CryptoJS.enc.Utf8));
//      console.log('login-info: ', JSON.stringify(loginInfo));
//
//      var enc = crypto.encrypt(JSON.stringify(loginInfo), value);
//      console.log('enc: ', enc.toString());
//    });

});

require(['test'], function(){});
