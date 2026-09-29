const CACHE='incidencias-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./escudo.png','./icono-192.png','./icono-512.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;
  // Red primero: siempre intenta traer la versión más reciente; solo usa el
  // caché (para trabajar sin conexión) si la red falla. Así los cambios se
  // ven de inmediato en cualquier navegador, sin quedarse con una copia vieja.
  e.respondWith(
    fetch(e.request).then(r=>{
      const c=r.clone();
      caches.open(CACHE).then(cc=>cc.put(e.request,c));
      return r;
    }).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html')))
  );
});
