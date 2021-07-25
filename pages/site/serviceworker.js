if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js', { scope: '.' }).then(function () {
    console.log('Service Worker Registered');
  });
}

var CACHE_STATIC = 'static-v002';

self.addEventListener('install', function (event) {
  self.skipWaiting();
  console.log('Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      console.log('Precaching App Shell');
      cache.addAll(['/login.html', '/login.css', '/offLine.html']);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC) {
            console.log('Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        if (response && !event.request.url.endsWith('/api/auth/logout')) {
          // console.log('From Cache', event.request.url);
          return response;
        }
        return fetch(event.request).then(function (response) {
          // console.log('From Network', event.request.method, response.status, event.request.url);
          if ((response.status === 200 || response.status === 0) && event.request.method !== 'POST' && event.request.method !== 'PATCH' && event.request.method !== 'DELETE') {
            return caches.open(CACHE_STATIC).then(function (cache) {
              // console.log('Put cache', event.request.method, event.request.url);
              cache.put(event.request.url, response.clone());
              return response;
            });
          } else if (response.status === 404) {
            return caches.match('/offLine.html');
          }
          return response;
        });
      })
      .catch(function () {
        return caches.match('/offLine.html');
      })
  );
});
