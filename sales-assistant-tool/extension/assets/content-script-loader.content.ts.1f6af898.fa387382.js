(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts.1f6af898.js")
    );
  })().catch(console.error);

})();
