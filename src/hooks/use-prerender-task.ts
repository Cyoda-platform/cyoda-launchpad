import { useEffect } from 'react';
import { registerPrerenderTask } from '@/lib/prerender-ready';

/**
 * Holds the prerender crawl open while `active && !done`.
 * Workflow viewers: active = graph parsed successfully, done = async layout
 * settled (resolved OR rejected). A parse failure (graph null) never registers,
 * so the error card is captured without blocking the crawl.
 */
export function usePrerenderTask(active: boolean, done: boolean) {
  useEffect(() => {
    if (!active || done) return;
    return registerPrerenderTask();
  }, [active, done]);
}
