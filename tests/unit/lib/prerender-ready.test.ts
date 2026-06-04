import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerPrerenderTask,
  markPageMounted,
  resetPrerenderReadyForTests,
} from '@/lib/prerender-ready';

beforeEach(() => {
  resetPrerenderReadyForTests();
});

describe('prerender readiness registry', () => {
  it('is not ready before the page mounts', () => {
    expect(window.__PRERENDER_READY__).toBe(false);
  });

  it('becomes ready once the page mounts with no pending tasks', () => {
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('stays not-ready while a task is pending and flips on release', () => {
    const release = registerPrerenderTask();
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(false);
    release();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('waits for ALL pending tasks and ignores double release', () => {
    const releaseA = registerPrerenderTask();
    const releaseB = registerPrerenderTask();
    markPageMounted();
    releaseA();
    releaseA(); // double release must not decrement twice
    expect(window.__PRERENDER_READY__).toBe(false);
    releaseB();
    expect(window.__PRERENDER_READY__).toBe(true);
  });

  it('tasks registered before the page mounts still gate readiness', () => {
    const release = registerPrerenderTask();
    expect(window.__PRERENDER_READY__).toBe(false);
    markPageMounted();
    expect(window.__PRERENDER_READY__).toBe(false);
    release();
    expect(window.__PRERENDER_READY__).toBe(true);
  });
});
