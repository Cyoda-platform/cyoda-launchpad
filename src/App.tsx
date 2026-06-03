import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AnalyticsManager } from "@/components/AnalyticsManager";
import { useAnalyticsTracking } from "@/hooks/use-analytics-tracking";
import { useUtmTracking } from "@/hooks/use-utm-tracking";

import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { appRoutes } from "@/routes";

const queryClient = new QueryClient();
// Lazy-load consent preferences UI to optimize initial load
const LazyCookiePreferencesModal = lazy(() => import("@/components/CookiePreferencesModal"));

// Component to handle analytics tracking inside Router context
const AnalyticsTracker = () => {
  useAnalyticsTracking();
  useUtmTracking(); // Capture UTM parameters on app load
  return null;
};

const App = () => {
  const [prefOpen, setPrefOpen] = useState(false);

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>


      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CookieConsentProvider>
          <ErrorBoundary>
            <AnalyticsManager />
          </ErrorBoundary>

          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AnalyticsTracker />
              <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                <Routes>
                  {appRoutes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                  ))}
                </Routes>
              </Suspense>

              {/* Global Cookie Consent Banner - hide when preferences modal is open */}
              {!prefOpen && (
                <ErrorBoundary>
                  <CookieConsentBanner onManagePreferences={() => setPrefOpen(true)} />
                </ErrorBoundary>
              )}
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <LazyCookiePreferencesModal open={prefOpen} onOpenChange={setPrefOpen} />
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </CookieConsentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
