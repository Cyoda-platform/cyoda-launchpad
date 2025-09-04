import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🔍</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              The page you're looking for doesn't exist or may have been moved.
            </p>
            <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Requested URL:</strong> {location.pathname}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-primary text-white glow-primary"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
