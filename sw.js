// Sorgt dafür, dass die App wie eine echte App startet und Updates sofort ankommen.
const CACHE = "gioia-daily";
const BASIS = ["./", "index.html", "style.css", "app.js", "einstellungen.js", "manifest.json", "icons/icon-192.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASIS)).catch(() => {}));
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Immer zuerst die neueste Version aus dem Internet holen, nur offline den Speicher nutzen.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then((antwort) => {
        if (antwort.ok) { const kopie = antwort.clone(); caches.open(CACHE).then((c) => c.put(e.request, kopie)); }
        return antwort;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
