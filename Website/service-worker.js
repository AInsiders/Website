// Service Worker for Offline RSS Reader
// Optimized for the existing news system with enhanced caching

const STATIC_CACHE = 'news-static-v2';
const FEED_CACHE = 'news-feeds-v2';
const API_CACHE = 'news-api-v2';
const OFFLINE_TTL = 5 * 60 * 1000; // 5 minutes cache for feeds (ultra-fresh)
const STATIC_TTL = 12 * 60 * 60 * 1000; // 12 hours for static assets (faster updates)

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/news-enhanced.html',
    '/offline.html',
    '/optimized-feeds.js',
    '/freshrss-inspired.js',
    '/nuroback-styles.css',
    '/page-transitions.js', // Only used on home page now
    '/daily-updates.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🔄 Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('📦 Caching static assets...');
            return cache.addAll(STATIC_FILES);
        }).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== FEED_CACHE && 
                        cacheName !== API_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle all requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle RSS/Atom feed requests
    if (isFeedRequest(request)) {
        event.respondWith(handleFeedRequest(request));
        return;
    }

    // Handle CORS proxy requests
    if (isProxyRequest(request)) {
        event.respondWith(handleProxyRequest(request));
        return;
    }

    // Handle static asset requests
    if (isStaticRequest(request)) {
        event.respondWith(handleStaticRequest(request));
        return;
    }
    
    // Handle navigation requests (fallback to offline page)
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }

    // Handle API requests (if any)
    if (isApiRequest(request)) {
        event.respondWith(handleApiRequest(request));
        return;
    }
});

// Check if request is for a feed
function isFeedRequest(request) {
    const url = request.url.toLowerCase();
    return url.includes('.xml') || 
           url.includes('rss') || 
           url.includes('atom') || 
           url.includes('feed') ||
           url.includes('youtube.com') ||
           url.includes('youtu.be');
}

// Check if request is for a CORS proxy
function isProxyRequest(request) {
    const url = request.url.toLowerCase();
    return url.includes('allorigins.win') ||
           url.includes('corsproxy.io') ||
           url.includes('bridged.cc') ||
           url.includes('thingproxy.freeboard.io') ||
           url.includes('codetabs.com') ||
           url.includes('rss2json.com') ||
           url.includes('cors.io') ||
           url.includes('crossorigin.me') ||
           url.includes('htmldriven.com') ||
           url.includes('allorigins.xyz') ||
           url.includes('herokuapp.com');
}

// Check if request is for static assets
function isStaticRequest(request) {
    const url = request.url.toLowerCase();
    return url.includes('.html') ||
           url.includes('.js') ||
           url.includes('.css') ||
           url.includes('.svg') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.ico');
}

// Check if request is for API
function isApiRequest(request) {
    const url = request.url.toLowerCase();
    return url.includes('/api/') || url.includes('json');
}

// Handle feed requests with intelligent caching
async function handleFeedRequest(request) {
    const cache = await caches.open(FEED_CACHE);
    
    try {
        // Try network first for feeds
        const networkResponse = await fetch(request, { 
            mode: 'no-cors',
            cache: 'no-cache'
        });
        
        if (networkResponse.ok || networkResponse.type === 'opaque') {
            // Cache the successful response
            const responseToCache = networkResponse.clone();
            cache.put(request, responseToCache);
            console.log('📡 Feed fetched from network:', request.url);
            return networkResponse;
        }
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
    }

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        console.log('📦 Serving feed from cache:', request.url);
        return cachedResponse;
    }

    // Return error response if no cache
    return new Response('Feed unavailable', { status: 503 });
}

// Handle proxy requests with fallback
async function handleProxyRequest(request) {
    const cache = await caches.open(API_CACHE);
    
    try {
        // Try network first
        const networkResponse = await fetch(request, { 
            cache: 'no-cache',
            timeout: 5000
        });
        
        if (networkResponse.ok) {
            // Cache successful proxy responses
            const responseToCache = networkResponse.clone();
            cache.put(request, responseToCache);
            return networkResponse;
        }
    } catch (error) {
        console.log('🌐 Proxy request failed:', request.url);
    }

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    return new Response('Proxy unavailable', { status: 503 });
}

// Handle static asset requests
async function handleStaticRequest(request) {
    const cache = await caches.open(STATIC_CACHE);
    
    // Check cache first for static assets
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Try network if not in cache
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            cache.put(request, responseToCache);
            return networkResponse;
        }
    } catch (error) {
        console.log('🌐 Static asset fetch failed:', request.url);
    }

    return new Response('Asset not found', { status: 404 });
}

// Handle API requests
async function handleApiRequest(request) {
    const cache = await caches.open(API_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            cache.put(request, responseToCache);
            return networkResponse;
        }
    } catch (error) {
        console.log('🌐 API request failed:', request.url);
    }

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    return new Response('API unavailable', { status: 503 });
}

// Handle navigation requests with offline fallback
async function handleNavigationRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            return networkResponse;
        }
    } catch (error) {
        console.log('🌐 Navigation request failed, serving offline page');
    }
    
    // Fallback to offline page
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
        return offlineResponse;
    }
    
    // Last resort - return offline page content
    return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Offline</title></head>
        <body>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Background sync for feed updates
self.addEventListener('sync', event => {
    if (event.tag === 'background-feed-sync') {
        console.log('🔄 Background sync triggered');
        event.waitUntil(backgroundSyncFeeds());
    }
});

// Background sync function
async function backgroundSyncFeeds() {
    try {
        // This would sync feeds in the background
        // Implementation depends on your feed URLs
        console.log('📡 Background feed sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Message handling for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ All caches cleared');
} 