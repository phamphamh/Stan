const CACHE_NAME = 'blackpink-app-v1'
const STATIC_CACHE_NAME = 'blackpink-static-v1'
const DYNAMIC_CACHE_NAME = 'blackpink-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/wallet',
  '/missions', 
  '/leaderboard',
  '/news',
  '/profile',
  '/shop',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/placeholder-logo.png'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('Service Worker: Failed to cache static assets', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (url.origin !== location.origin) return

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Navigation requests - network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request))
    return
  }

  // Other requests - cache first, network fallback
  event.respondWith(cacheFirstStrategy(request))
})

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Cache-first strategy failed:', error)
    return new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(JSON.stringify({ error: 'Offline mode' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Navigation strategy with offline fallback
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Navigation failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    const offlinePage = await caches.match('/offline')
    if (offlinePage) {
      return offlinePage
    }
    
    // Fallback to home page
    return caches.match('/')
  }
}

// Check if request is for static asset
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/images/') ||
         pathname.includes('.css') ||
         pathname.includes('.js') ||
         pathname.includes('.png') ||
         pathname.includes('.jpg') ||
         pathname.includes('.svg')
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'wallet-sync') {
    event.waitUntil(syncWalletData())
  }
  
  if (event.tag === 'mission-sync') {
    event.waitUntil(syncMissionData())
  }
})

// Sync wallet data when online
async function syncWalletData() {
  try {
    // Get pending wallet actions from IndexedDB
    // Send to server when online
    console.log('Service Worker: Syncing wallet data')
  } catch (error) {
    console.error('Failed to sync wallet data:', error)
  }
}

// Sync mission data when online
async function syncMissionData() {
  try {
    // Get pending mission completions from IndexedDB  
    // Send to server when online
    console.log('Service Worker: Syncing mission data')
  } catch (error) {
    console.error('Failed to sync mission data:', error)
  }
}

// Push notification handler
self.addEventListener('push', event => {
  console.log('Service Worker: Push received')
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [300, 100, 400],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('BLACKPINK Fan App', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})