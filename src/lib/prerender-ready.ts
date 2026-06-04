// Readiness contract for the build-time prerender crawl (scripts/prerender.mjs).
// The crawl's primary signal is window.__PRERENDER_READY__ === true, which means:
// the routed page has mounted AND every registered async task (workflow-viewer
// layout) has settled. Inert during normal browsing — it only maintains a window
// flag that nothing in the app reads.
// Relies on a fresh document per crawled URL; pageMounted is sticky, so this is NOT a reliable signal across client-side SPA navigations.
declare global {
  interface Window {
    __PRERENDER_READY__?: boolean;
  }
}

let pendingTasks = 0;
let pageMounted = false;

function publish() {
  if (typeof window !== 'undefined') {
    window.__PRERENDER_READY__ = pageMounted && pendingTasks === 0;
  }
}

/**
 * Mark a unit of async work as pending. Call the returned release function
 * exactly once when the work settles (success OR error — a hung task would
 * surface as an opaque crawl timeout).
 */
export function registerPrerenderTask(): () => void {
  pendingTasks += 1;
  publish();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    pendingTasks -= 1;
    publish();
  };
}

/** Called once the routed page component has committed (see PrerenderReadySignal in App.tsx). */
export function markPageMounted() {
  pageMounted = true;
  publish();
}

/** Test-only. */
export function resetPrerenderReadyForTests() {
  pendingTasks = 0;
  pageMounted = false;
  publish();
}
