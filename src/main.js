import './app/psr-router-app';

// Load and register pre-caching Service Worker
window.isUpdateAvailable = new Promise(function(resolve, reject) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', {
        scope: MyAppGlobals.rootPath
      }).then(registration => {
        console.debug('SW registered: ', registration);
        registration.onupdatefound = function() {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = function () {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // new update available
                  resolve(true);
                } else {
                  // no update available
                  resolve(false);
                }
                break;
            }
          }
        };
      }).catch(registrationError => {
        console.error('SW registration failed: ', registrationError);
      });
    });
  }
});
