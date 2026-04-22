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


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/98 backdrop-blur-sm">
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
                        { label: 'Architecture', sub: 'How the EDBMS works', to: '/#how-it-works', hash: true },
                        { label: 'Compare vs. alternatives', sub: 'Temporal, Camunda, Kafka, XTDB', to: '/comparison' },
                      ].map((item) => (
                        <NavigationMenuLink key={item.label} asChild>
                          {item.hash ? (
                            <HashLink smooth to={item.to} className="block group">
                              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                            </HashLink>
                          ) : (
                            <Link to={item.to} className="block group">
                              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                            </Link>
                          )}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Resources</p>
                    <div className="space-y-4">
                      <NavigationMenuLink asChild>
                        <a href="https://docs.cyoda.net" target="_blank" rel="noopener noreferrer" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Documentation</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Full docs at docs.cyoda.net</div>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="https://docs.cyoda.net/api-reference/" target="_blank" rel="noopener noreferrer" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">API Reference</div>
                          <div className="text-xs text-muted-foreground mt-0.5">gRPC and REST API docs</div>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/blog" className="block group">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Blog</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Engineering and product articles</div>
                        </Link>
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

            {/* Cyoda Cloud — external top-level link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="https://ai.cyoda.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Cyoda Cloud
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Open Source — external top-level link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="https://cyoda.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Open Source
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Docs — single external link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="https://docs.cyoda.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Docs
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="outline" className="glow-hover mobile-btn-text">
              <Link to="/contact">Contact</Link>
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
              <Link to="/comparison" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Compare vs. alternatives</Link>

              <p className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-3">Solutions</p>
              <Link to="/use-cases/loan-lifecycle" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Loan Origination &amp; Lifecycle</Link>
              <Link to="/use-cases/trade-settlement" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Trade Settlement &amp; Reporting</Link>
              <Link to="/use-cases/kyc-onboarding" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">KYC &amp; Customer Onboarding</Link>
              <Link to="/use-cases/agentic-ai" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Agentic AI</Link>
              <Link to="/cto" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">For Engineering Leaders</Link>
              <Link to="/dev" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">For Developers</Link>

              <p className="py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-3">Cyoda Web</p>
              <a href="https://ai.cyoda.net/" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Cyoda Cloud ↗</a>
              <a href="https://cyoda.org" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors">Open Source ↗</a>
              <a href="https://docs.cyoda.net/" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-primary transition-colors">Docs ↗</a>
              <a href="https://docs.cyoda.net/api-reference/" target="_blank" rel="noopener noreferrer" className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-primary transition-colors">API Reference ↗</a>

              <Link to="/blog" className="block py-2 text-foreground hover:text-primary transition-colors font-medium">Blog</Link>
            </nav>

            <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="justify-start mobile-btn-text">
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
