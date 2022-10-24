if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log("Service Worker registered"))
    .catch(err => console.log("Service Worker NOT registered", err))
}

const STATIC_CACHE = `app-static-${new Date().getTime()}`;
const DYNAMIC_CACHE = `app-dynamic-${new Date().getTime()}`;

const ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/polyfills.js",
  "/js/script-dist.js",
  "https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Pathway+Gothic+One&display=swap",
  "/sound/click.wav",
  "/sound/darth-vader-breathing-alt.mp3",
  "/sound/darth-vader-breathing.mp3",
  "/sound/duel-of-the-fates.mp3",
  "/sound/hit-1.mp3",
  "/sound/hit-2.mp3",
  "/sound/hit-3.mp3",
  "/sound/ls-on-1.mp3",
  "/sound/ls-on-2.mp3",
  "/sound/ls-on-3.mp3",
  "/sound/match.wav",
  "/sound/mis-1.mp3",
  "/sound/mis-2.mp3",
  "/sound/star-wars-main-theme-song.mp3",
  "/sound/the-throne-room.mp3",
  "/sound/unmatch.wav",
  "/img/cards/ackbar.png",
  "/img/cards/amidala.png",
  "/img/cards/bb8.png",
  "/img/cards/ben_kenobi.png",
  "/img/cards/ben_solo.png",
  "/img/cards/binks.png",
  "/img/cards/boba_fett.png",
  "/img/cards/c3po.png",
  "/img/cards/card_back.png",
  "/img/cards/chewbacca.png",
  "/img/cards/darth_maul_alt.png",
  "/img/cards/darth_maul.png",
  "/img/cards/droid.png",
  "/img/cards/grievous.png",
  "/img/cards/gunray.png",
  "/img/cards/jabba.png",
  "/img/cards/jango.png",
  "/img/cards/kylo.png",
  "/img/cards/lando.png",
  "/img/cards/leia.png",
  "/img/cards/mandalorian.png",
  "/img/cards/nunb.png",
  "/img/cards/obiwan_kenobi.png",
  "/img/cards/old_luke.png",
  "/img/cards/palpatine.png",
  "/img/cards/phasma.png",
  "/img/cards/pilot.png",
  "/img/cards/placeholder.png",
  "/img/cards/quigon_jinn.png",
  "/img/cards/r2d2.png",
  "/img/cards/rey.png",
  "/img/cards/rune.png",
  "/img/cards/scout.png",
  "/img/cards/sidious.png",
  "/img/cards/solo.png",
  "/img/cards/stormtrooper.png",
  "/img/cards/trooper.png",
  "/img/cards/tusken_raider.png",
  "/img/cards/vader.png",
  "/img/cards/war_padme.png",
  "/img/cards/warrick.png",
  "/img/cards/watto.png",
  "/img/cards/windu.png",
  "/img/cards/yoda.png",
  "/img/cards/young_anakin.png",
  "/img/cards/young_luke.png",
  "/img/interface/cursors/not-allowed.png",
  "/img/interface/cursors/pointer.png",
  "/img/interface/cursors/standart.png",
  "/img/interface/skip.svg",
  "/img/interface/start-click.svg",
  "/img/interface/start-touch.svg",
  "/img/interface/wait-loader.svg",
  "/img/logos/darth-vader.svg",
  "/img/logos/rabels.svg",
  "/img/logos/star-wars-logo.svg"
];

// install service worker
self.addEventListener("install", e => {
  //console.log("Service Worker has been installed", e);
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        cache.addAll(ASSETS).catch(err => console.log("Error while trying to put item in STATIC_CACHE", err));
      })
      .catch(err => console.log("Error during caching", err))
  );
});
//
// service worker activation event 
self.addEventListener("activate", e => {
  //console.log("Service Worker has been activated", e);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
      )
    })
  );
});

// fetch event
self.addEventListener("fetch", e => {
  //console.log("Fetch event", e);
  e.respondWith(
    caches.match(e.request)
      .then(cacheRes => {
        return cacheRes || fetch(e.request)
          .then(fetchRes => {
            return caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(e.request.url, fetchRes.clone()).catch(err => console.log("Error while trying to put item in DYNAMIC_CACHE", err));
                return fetchRes;
              })
          })
      })
      .catch(err => console.log("Error during fetch event", err))
  )
});