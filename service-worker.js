/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "95ff5457bdc79ee17a701e56b7e1bef3"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "3ce44be4ee16cedc6719ae84a802f55f"
  },
  {
    "url": "architecture/back.html",
    "revision": "0a44fbab887354a82c3678d1ca65bf9a"
  },
  {
    "url": "architecture/index.html",
    "revision": "a7fb6ceefabfa74a192534480ccf9699"
  },
  {
    "url": "architecture/maintain.html",
    "revision": "77cd6dd572fd6c713f69472d14e4edf9"
  },
  {
    "url": "architecture/other.html",
    "revision": "8e0e1b3d10b75805598c33f1d70037e3"
  },
  {
    "url": "architecture/summary.html",
    "revision": "8b9ad05fd1597d1c9f751c1fce5a4afc"
  },
  {
    "url": "architecture/web.html",
    "revision": "e8deedd50dcc6460da0023748ad39b1c"
  },
  {
    "url": "assets/css/0.styles.858f56bf.css",
    "revision": "b52e6ebef3cfa34fa9ccd7604cbb57f3"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.5f0e03c2.js",
    "revision": "797dd11f0cd53761cf140a6700af4eeb"
  },
  {
    "url": "assets/js/11.eacf953d.js",
    "revision": "56e7c6113498aa34a512f7182bdc24d5"
  },
  {
    "url": "assets/js/12.bedea048.js",
    "revision": "f6f51e9d8c285d85c9b5532aab88576f"
  },
  {
    "url": "assets/js/13.0aa78ebe.js",
    "revision": "7b1de551ad5120b0a30179cf75e7278d"
  },
  {
    "url": "assets/js/14.44ce8ad2.js",
    "revision": "048b1d33758aaf9f270f91bf12894b7e"
  },
  {
    "url": "assets/js/15.db0d303b.js",
    "revision": "2369f4c4ff72f5fdf87cabac6b56cc01"
  },
  {
    "url": "assets/js/16.0b53dac7.js",
    "revision": "82bae86823a2446c082d6a95ef1b8ba7"
  },
  {
    "url": "assets/js/17.2afb900e.js",
    "revision": "264d20d3a88adc25564da6b13d77d45d"
  },
  {
    "url": "assets/js/18.9ddb41a6.js",
    "revision": "2989dfaedd88da4c19dae5b035fc896c"
  },
  {
    "url": "assets/js/19.66d23c63.js",
    "revision": "d2c8e391cd07086af1974ddfc24c2675"
  },
  {
    "url": "assets/js/2.04738c42.js",
    "revision": "a94468c154bb804dfc68991fb9f17d7e"
  },
  {
    "url": "assets/js/20.4eea7b7b.js",
    "revision": "bd983aed5165b76e0e62a3add2c53fe5"
  },
  {
    "url": "assets/js/21.093b88ea.js",
    "revision": "5316a3db8a59cbffa05482c1c096f8f9"
  },
  {
    "url": "assets/js/22.644f3eba.js",
    "revision": "043f2730849b6632664c8985385f707a"
  },
  {
    "url": "assets/js/3.1b52fbe7.js",
    "revision": "b19f85876962c20a0b5f0cbd3d6dc9eb"
  },
  {
    "url": "assets/js/4.139c2291.js",
    "revision": "4070d20668df1697c6ba51d74b69d9e4"
  },
  {
    "url": "assets/js/5.faf28de6.js",
    "revision": "ceb729b920d6264da48ecfbfdb46a86e"
  },
  {
    "url": "assets/js/6.85ee2228.js",
    "revision": "cff06e1a5f400ca057c284326c4ef8ff"
  },
  {
    "url": "assets/js/7.d0cd05bd.js",
    "revision": "8b02b7b83773db0b2c079418ece2b8b3"
  },
  {
    "url": "assets/js/8.a2a5c451.js",
    "revision": "148033cb124e7644d7ce1561f8dc8812"
  },
  {
    "url": "assets/js/9.d656f4dc.js",
    "revision": "f93f83d352527408055e0247ec2641c7"
  },
  {
    "url": "assets/js/app.3393022b.js",
    "revision": "be2f7b1d9ae60970ca6da947d638ce64"
  },
  {
    "url": "demand/action/adaptation.html",
    "revision": "ea50191d3219608e6614927e7fef72f8"
  },
  {
    "url": "demand/action/next.html",
    "revision": "f5717d3250826ed669e46e22257883ff"
  },
  {
    "url": "demand/action/start.html",
    "revision": "1e565f94111940ae6c3e9816e14312db"
  },
  {
    "url": "demand/index.html",
    "revision": "643673b06e377619a83956c522e7f317"
  },
  {
    "url": "demand/system/admin.html",
    "revision": "feb70d12e8d0d4ae384f0ae4e89d2e5a"
  },
  {
    "url": "demand/system/base.html",
    "revision": "e4a53e178009787a795cde64b049f18f"
  },
  {
    "url": "demand/system/ready.html",
    "revision": "0848aec0ba03b50b811ff2f0d3e2512f"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "c1442bac245f31cc0b8eae046359244b"
  },
  {
    "url": "gak.png",
    "revision": "3b24a09072ebaca96ba706cf35c058f8"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "eade36696ed175a2c24f33b764adc140"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "921ecd9886c847ac40a9ddb99c14f320"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "dbb4e9a8dccfc97cf5c0e243cbad3acf"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "6d124d59b7fe91b0afb7a149f6fab01e"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "864ad75704e67ee2ba6287f9b3bb98d8"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "864ad75704e67ee2ba6287f9b3bb98d8"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "ccb5ca78e5567c22d47e29b8b1c0743b"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "13449f4cfc4e84bc433ec6a1994e7977"
  },
  {
    "url": "index.html",
    "revision": "a16645d02a31b5910e877792f41ea11a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
