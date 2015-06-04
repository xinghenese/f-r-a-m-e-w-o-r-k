/**
 * Created by Administrator on 2015/6/4.
 */

/** @jsx React.DOM */

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
    eventEmitter: "../../lib/eventEmitter/EventEmitter",

    JSXTransformer: "../../lib/jsx-requirejs-plugin/js/JSXTransformer",
    text: "../../lib/requirejs-text/text",
    jsx: "../../lib/jsx-requirejs-plugin/js/jsx"
  },
  jsx:{
    fileExtension: '.jsx'
  },
  packages: [

  ]
});

require(['react', 'jsx!../components/app'], function(React, App){

  var Ap = React.createFactory(App);

  React.render(
    Ap(),
    document.getElementById('content')
  );
});