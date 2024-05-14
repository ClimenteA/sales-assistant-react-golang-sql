(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts.b6e8efc4.js")
    );
  })().catch(console.error);

})();
