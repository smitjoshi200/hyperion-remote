self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('app-cache').then(cache => {
            return cache.addAll([
                '/icon.png',
                '/index.html',
                '/manifest.json',
                '/service-worker.js',
                '/style.css',
                '/process_data.js',
                // Add more assets to cache
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

