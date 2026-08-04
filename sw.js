const CACHE='incidencias-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./escudo.png','./icono-192.png','./icono-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{
    const c=r.clone();caches.open(CACHE).then(cc=>cc.put(e.request,c));return r;
  }).catch(()=>caches.match('./index.html'))));
});