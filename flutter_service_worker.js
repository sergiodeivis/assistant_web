'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "06cba6e18ccf2523e5872e3bf9af8706",
"assets/AssetManifest.bin.json": "157df3b29f11e31263df6538f72db43d",
"assets/AssetManifest.json": "49d88462ff6c38713334ea7c9560b2b5",
"assets/assets/images/cbw-logo-black-white_bg.svg": "f30926f1cbd094cccb645da6490d9c17",
"assets/assets/images/cbw-logo-no_bg.svg": "28c3b4d61d0752b12c00ee3425b2e439",
"assets/assets/images/cbw-logo-white-black_bg.svg": "524c05e6481a7bf8b1ab3b2aa0dca1ac",
"assets/assets/images/cbw-logo-white-blue_bg.svg": "3acb24c2ba59fbfee8a973b1d27c9536",
"assets/assets/images/cbw-logo-white-brown_bg.svg": "7610762eaeef2e51c69004712ccc6503",
"assets/assets/images/cbw-logo-white-transparent_bg.svg": "92868f23c61a1cb883a9c0972da0cf59",
"assets/assets/images/cbw-symbol-black-white_bg.svg": "fac2172678bbcf8548e5b26d1fc39093",
"assets/assets/images/cbw-symbol-black.svg": "b52547a81cadaec55df91cd88567f7d7",
"assets/assets/images/cbw-symbol-white-black_bg.svg": "5189d2726714ea9b458dbccb81fabf56",
"assets/assets/images/cbw-symbol-white-blue_bg.svg": "52743a547dbb49994975a8ba2247400e",
"assets/assets/images/cbw-symbol-white-brown_bg.svg": "03f432f41c4efba2ce5c797bb47309ad",
"assets/assets/images/cbw-symbol-white.svg": "f84ce9e6864dbddc914d9625538275cc",
"assets/assets/images/doctor-avatar.png": "ef681b6650bc0fc367b808521d6087a3",
"assets/assets/images/hero-cowboy.jpg": "109230b136a53deb49ca991b36ab1a5e",
"assets/assets/images/newsletter-bg.jpg": "91531276d7122576557bc4635dbae5b4",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1595f946efcd32d0d868a30b7292ceff",
"assets/NOTICES": "1bb68588f639d254b1cb4736c5da6ca9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "bbc180f2d5de01a44cdbee2275379f45",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "2008db06b19839435a242336b54e2b07",
"icons/Icon-192.png": "30a64ada943996d5765939e092eea86a",
"icons/Icon-512.png": "aec009f7066279e9e38fa33845712de2",
"icons/Icon-maskable-192.png": "5660a631f6db4230d79a08f4cf413407",
"icons/Icon-maskable-512.png": "db57e225e1bdc7b2ef7913eca494a9b3",
"index.html": "91a71b16d48b3c8bfee02cb19b2fb7a9",
"/": "91a71b16d48b3c8bfee02cb19b2fb7a9",
"index.html.bak": "91a71b16d48b3c8bfee02cb19b2fb7a9",
"main.dart.js": "304b5e718b53fe15df1c8bf6eb1e4f34",
"manifest.json": "cd0b40e332de17816e3c58a277f4dd3e",
"version.json": "d45c97e67d354396f47c82c7c4c5a50b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
