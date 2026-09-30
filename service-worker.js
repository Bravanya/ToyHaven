var CACHE_NAME = 'toy-haven-v6';



self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      var deleteOld = [];
      for (var i = 0; i < cacheNames.length; i++) {
        if (cacheNames[i] !== CACHE_NAME) {
          deleteOld.push(caches.delete(cacheNames[i]));
        }
      }
      return Promise.all(deleteOld);
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }).catch(function () {
      return caches.match('index.html');
    })
  );
});
