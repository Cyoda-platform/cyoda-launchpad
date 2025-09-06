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

import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogTest = lazy(() => import("./pages/BlogTest"));
const BlogSystemTest = lazy(() => import("./pages/BlogSystemTest"));
const Support = lazy(() => import("./pages/Support"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Cookie consent test component
const CookieConsentTest = lazy(() => import("./components/CookieConsentTest").then(module => ({ default: module.CookieConsentTest })));

const queryClient = new QueryClient();
// Lazy-load consent preferences UI to optimize initial load
const LazyCookiePreferencesModal = lazy(() => import("@/components/CookiePreferencesModal"));
const LazyCookiePreferences = lazy(() => import("@/components/CookiePreferences"));

const App = () => {
  const [prefOpen, setPrefOpen] = useState(false);
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>


      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CookieConsentProvider>
          <ErrorBoundary>
            <AnalyticsManager />
          </ErrorBoundary>

          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/blog-test" element={<BlogTest />} />
                  <Route path="/blog-system-test" element={<BlogSystemTest />} />
                  <Route path="/cookie-consent-test" element={<CookieConsentTest />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              {/* Global Cookie Consent Banner */}
              <ErrorBoundary>
                <CookieConsentBanner onManagePreferences={() => setPrefOpen(true)} />
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <LazyCookiePreferencesModal open={prefOpen} onOpenChange={setPrefOpen} />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={null}>
                  <LazyCookiePreferences />
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
