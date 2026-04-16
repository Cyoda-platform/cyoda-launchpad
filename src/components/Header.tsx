import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import cyodaLogo from '@/assets/cyoda-logo.png';
import { trackCtaConversion } from '@/utils/analytics';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const getPageVariant = (): "home" | "dev" | "cto" | "products" | "pricing" => {
    const path = location.pathname;
    if (path === '/dev') return 'dev';
    if (path === '/cto') return 'cto';
    if (path === '/products') return 'products';
    if (path === '/pricing') return 'pricing';
    return 'home';
  };

  const handleTryNowClick = (locationId: "header" | "header_mobile") => {
    trackCtaConversion({
      location: locationId,
      page_variant: getPageVariant(),
      cta: "try_now",
      url: "https://ai.cyoda.net"
    });
    window.open('https://ai.cyoda.net', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 glow-hover">
            <img src={cyodaLogo} alt="Cyoda" className="h-6 sm:h-6" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-6">

            {/* Platform Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors font-medium">
                Platform
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-2 w-[540px] gap-6 p-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Product</p>
                    <div className="space-y-4">
                      {[
                        { label: 'EDBMS Platform', sub: 'Unified data + workflow + audit', to: '/products' },
                        { label: 'AI Assistant', sub: 'Prototype in natural language', to: '/products#ai-assistant' },
                        { label: 'Cyoda Cloud', sub: 'Managed cloud service, free tier', to: '/products#cyoda-cloud' },
                        { label: 'On-Premise (CPL)', sub: 'Self-hosted on Kubernetes', to: '/products#on-premise' },
                      ].map((item) => (
                        <NavigationMenuLink key={item.label} asChild>
                          <Link to={item.to} className="block group">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Learn</p>
                    <div className="space-y-4">
                      <NavigationMenuLink asChild>
                        <HashLink smooth to="/#how-it-works" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Architecture</div>
                          <div className="text-xs text-muted-foreground mt-0.5">How the EDBMS works</div>
                        </HashLink>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/comparison" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Compare vs. alternatives</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Temporal, Camunda, Kafka, XTDB</div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="https://docs.cyoda.net" target="_blank" rel="noopener noreferrer" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Documentation</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Full docs at docs.cyoda.net</div>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="https://ai.cyoda.net" target="_blank" rel="noopener noreferrer" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Quickstart</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Start at ai.cyoda.net</div>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Solutions Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors font-medium">
                Solutions
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-2 w-[520px] gap-6 p-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">By Use Case</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Loan Origination & Lifecycle', sub: 'State machine from application to settlement', to: '/use-cases/loan-lifecycle' },
                        { label: 'Trade Settlement & Reporting', sub: 'Point-in-time queryable trade states', to: '/use-cases/trade-settlement' },
                        { label: 'KYC & Customer Onboarding', sub: 'Durable retry with full audit', to: '/use-cases/kyc-onboarding' },
                        { label: 'Agentic AI for Regulated Industries', sub: 'Transactional, auditable agent actions', to: '/use-cases/agentic-ai' },
                      ].map((item) => (
                        <NavigationMenuLink key={item.label} asChild>
                          <Link to={item.to} className="block group">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">By Role</p>
                    <div className="space-y-4">
                      {[
                        { label: 'For Engineering Leaders', sub: 'Architecture, team size, compliance', to: '/cto' },
                        { label: 'For Developers', sub: 'Build, integrate, deploy', to: '/dev' },
                      ].map((item) => (
                        <NavigationMenuLink key={item.label} asChild>
                          <Link to={item.to} className="block group">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Pricing */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/pricing"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Docs Dropdown — unchanged */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors font-medium">
                Docs
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-64 gap-3 p-4">
                  <NavigationMenuLink asChild>
                    <Link to="https://docs.cyoda.net/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                      Developer Docs
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm hover:text-primary transition-colors">
                    <Link to="https://docs.cyoda.net/api-reference/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                      API Reference
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm text-muted-foreground">
                    Video Explanations (coming soon)
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/blog"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="outline" className="glow-hover mobile-btn-text">
              <HashLink smooth to="/support#contact">Contact</HashLink>
            </Button>
            <Button
              variant="outline"
              className="glow-hover mobile-btn-text"
              onClick={() => handleTryNowClick("header")}
            >
              Try Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden glow-hover min-h-[44px] min-w-[44px] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-4">
            <nav className="space-y-1">
              <p className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Platform</p>
              <Link to="/products" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">EDBMS Platform</Link>
              <Link to="/products#ai-assistant" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">AI Assistant</Link>
              <Link to="/products#cyoda-cloud" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Cyoda Cloud</Link>
              <Link to="/comparison" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Compare vs. alternatives</Link>

              <p className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-3">Solutions</p>
              <Link to="/use-cases/loan-lifecycle" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Loan Origination &amp; Lifecycle</Link>
              <Link to="/use-cases/trade-settlement" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Trade Settlement &amp; Reporting</Link>
              <Link to="/use-cases/kyc-onboarding" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">KYC &amp; Customer Onboarding</Link>
              <Link to="/use-cases/agentic-ai" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Agentic AI</Link>
              <Link to="/cto" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">For Engineering Leaders</Link>
              <Link to="/dev" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">For Developers</Link>

              <Link to="/pricing" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">Pricing</Link>

              <p className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-3">Docs</p>
              <a href="https://docs.cyoda.net/" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-primary transition-colors">Developer Docs</a>
              <a href="https://docs.cyoda.net/api-reference/" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</a>
              <span className="block py-1.5 pl-3 text-sm text-muted-foreground">Video Explanations (coming soon)</span>

              <Link to="/blog" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">Blog</Link>
            </nav>

            <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="justify-start mobile-btn-text">
                <HashLink smooth to="/support#contact">Contact</HashLink>
              </Button>
              <Button
                className="bg-gradient-primary text-white justify-start mobile-btn-text"
                onClick={() => handleTryNowClick("header_mobile")}
              >
                Try Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
