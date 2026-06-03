import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export type AppRoute = {
  path: string;
  component: LazyExoticComponent<ComponentType>;
  /** true = emit a static HTML file; false = exclude (test/dev/catch-all); "blog" = expand from blog-index.json */
  prerender: boolean | "blog";
  /** CSS selector the prerender crawl waits for before capturing (default: "main") */
  waitFor?: string;
};

// Single source of truth for routing, prerendering, and sitemap generation.
// scripts/prerender.mjs loads this module via Vite ssrLoadModule and reads ONLY
// path / prerender / waitFor — it never touches `component`. Keep this file free
// of eval-time side effects beyond the lazy() calls themselves (their dynamic
// import() is never invoked by the build scripts).
export const appRoutes: AppRoute[] = [
  { path: "/", component: lazy(() => import("./pages/Index")), prerender: true },
  { path: "/blog", component: lazy(() => import("./pages/Blog")), prerender: true },
  { path: "/blog/:slug", component: lazy(() => import("./pages/BlogPost")), prerender: "blog", waitFor: "article" },
  { path: "/blog-test", component: lazy(() => import("./pages/BlogTest")), prerender: false },
  { path: "/blog-system-test", component: lazy(() => import("./pages/BlogSystemTest")), prerender: false },
  // /guides and /guides/:slug stay disabled (they were commented out in App.tsx).
  { path: "/guide-system-test", component: lazy(() => import("./pages/GuideSystemTest")), prerender: false },
  // CookieConsentTest is a named export — preserve the .then() default mapping.
  { path: "/cookie-consent-test", component: lazy(() => import("./components/CookieConsentTest").then((m) => ({ default: m.CookieConsentTest }))), prerender: false },
  { path: "/support", component: lazy(() => import("./pages/Support")), prerender: true },
  { path: "/cookie-policy", component: lazy(() => import("./pages/CookiePolicy")), prerender: true },
  { path: "/privacy-policy", component: lazy(() => import("./pages/PrivacyPolicy")), prerender: true },
  { path: "/terms-of-service", component: lazy(() => import("./pages/TermsOfService")), prerender: true },
  { path: "/dev", component: lazy(() => import("./pages/Dev")), prerender: true },
  { path: "/cto", component: lazy(() => import("./pages/Cto")), prerender: true },
  { path: "/about", component: lazy(() => import("./pages/About")), prerender: true },
  { path: "/use-cases", component: lazy(() => import("./pages/UseCases")), prerender: true },
  { path: "/use-cases/loan-lifecycle", component: lazy(() => import("./pages/UseCaseLoanLifecycle")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/trade-settlement", component: lazy(() => import("./pages/UseCaseTradeSettlement")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/kyc-onboarding", component: lazy(() => import("./pages/UseCaseKycOnboarding")), prerender: true, waitFor: ".react-flow__node" },
  // Three intentional aliases for the same page — they preserve external links. Do NOT deduplicate.
  { path: "/use-cases/governed-agentic-workflows", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/governed-ai-actions", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/governed-claims-adjudication", component: lazy(() => import("./pages/UseCaseGovernedClaimsAdjudication")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/use-cases/agentic-ai", component: lazy(() => import("./pages/UseCaseGovernedAiActions")), prerender: true, waitFor: ".react-flow__node" },
  { path: "/contact", component: lazy(() => import("./pages/Contact")), prerender: true },
  { path: "/comparison", component: lazy(() => import("./pages/Comparison")), prerender: true },
  // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
  { path: "*", component: lazy(() => import("./pages/NotFound")), prerender: false },
];
