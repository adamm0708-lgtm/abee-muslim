/* ABEE Muslim — service worker minimal.
 *
 * Prinsip: data (jadwal shalat, Al-Qur'an, cuaca) SELALU network-first —
 * jangan pernah sajikan data basi. Hanya app shell + aset statis yang
 * di-cache, supaya aplikasi tetap bisa dibuka saat offline.
 */
const CACHE = "abee-muslim-v1";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png",
  "/apple-touch-icon.png",
];

// Host API/data: network-first murni (tanpa fallback cache).
const API_HOSTS = new Set([
  "api.myquran.com",
  "api.aladhan.com",
  "api.quran.com",
  "api.alquran.cloud",
  "cdn.islamic.network",
  "api.open-meteo.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {
        /* Instalasi SW boleh gagal saat offline; dicoba lagi di kunjungan berikut. */
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // 1. API/data: network-first, tanpa fallback cache (aplikasi menampilkan
  //    pesan error sendiri kalau offline — lebih jujur daripada data basi).
  if (API_HOSTS.has(url.hostname)) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Navigasi: network-first; kalau offline, sajikan app shell yang di-cache.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put("/", copy));
          }
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // 3. Aset statis same-origin (JS/CSS/ikon): stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
