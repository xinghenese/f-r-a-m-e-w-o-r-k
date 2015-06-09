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
    rawdeflate: "../../lib/gzip-js/node_modules/deflate-js/lib/rawdeflate",
    eventEmitter: "../../lib/eventEmitter/EventEmitter"
  },
  packages: [

  ]
});

define('test', function(require, exports, module){

  var connection = require('../net/connection/httpconnection');
  var factory = require('../net/crypto/factory');
  var processible = require('../net/crypto/processible');
  var keyExchange = factory.createKeyExchange();
  var codec = factory.createCodec();
  var crypto = factory.createCipher();
  var protocolpacket = require('../net/protocolpacket/protocolpacket');
  var userconfig = require('../net/userconfig/userconfig');

  //Test
  var privateKey = new BigInteger('319637343895370892858853686689505691917413860741718771000839144031633667752202993537955587207619378607375395949547747397280498144239164859688496909177084158520866739311933758196512852089859922542234163352959635572419005789642760060678869919693683729641370950790037480330694706747840584523128557482055781791708302572749161862050411673030076079712162784595290569874537736474582530337876420739570740236183951777254772503137230442962745476070154264667784810231894739039585016001352394819428798397099822405446249441702536192950150975784600831981173777039218482832845513149810424793783986834281068369034963442030270006452446066312440934194863966409219135063028989073074536928551879629068464115547537483174077504524704578493979043365265113837097301', 10, true);
  console.log('privateKey: ', privateKey.toString(16));
  //


  console.log('keyExchange.publicKey: ', keyExchange.getPublicKey());

//  connect0();
  connect1();

  function connect0() {
    connection
      .disableConfig()
  //    .post("auth/c", packet)
      .request(protocolpacket.create({
        'url': "auth/c",
        'data': {
          'pk': keyExchange.getPublicKey(),
          'uuid': userconfig.getUuid(),
  //        'web': '1'
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
      });
  }


  function connect1(){
    connection
      .request(protocolpacket.create({
        'url': "usr/lg",
        'data': {
          mid: '18616371916',
          c: 1122,
          pf: 1,
          os: 'PC',
          dv: '1',
          di: '1122334455',
          uuid: '7e9d-501c-dbd816078039'
        }
      }))
      .then(function(value){
        console.log(value);
      });
  }

});

require(['test'], function(){});
