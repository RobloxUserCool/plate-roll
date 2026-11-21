/* Сначала сеть, потом кэш: новая версия index.html подхватывается сама, без переустановки. */
var CACHE = 'plate-app';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r, { cache: 'no-cache' }).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(r, copy); });
      return res;
    }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./'); }); })
  );
});
