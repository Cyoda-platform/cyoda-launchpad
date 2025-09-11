import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SiGithub, SiLinkedin, SiX, SiYoutube, } from "react-icons/si";
import { Menu,    X,    ChevronDown} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import cyodaLogo from '@/assets/cyoda-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const socialLinks = [
    { icon: SiLinkedin, href: 'https://www.linkedin.com/company/cyoda', label: 'LinkedIn' },
    { icon: SiX, href: 'https://twitter.com/cyodaops', label: 'X (Twitter)' },
    { icon: SiYoutube, href: 'https://www.youtube.com/@cyoda934', label: 'YouTube' },
    { icon: SiGithub, href: 'https://github.com/Cyoda-platform/', label: 'GitHub' },
  ];

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
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/products"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
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
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors font-medium">
                Docs
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-64 gap-3 p-4">
                  <NavigationMenuLink asChild>
                    <Link to="/guides" className="text-sm hover:text-primary transition-colors">
                      Guides
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm hover:text-primary transition-colors">
                    Application Documentation
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm text-muted-foreground">
                    Video Explanations (coming soon)
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
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
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/support"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Support
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary glow-hover transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={social.label}
              >
                <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            ))}
          </div>

          <ThemeToggle />

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" className="glow-hover mobile-btn-text"
                    onClick={() => window.open('https://discord.gg/uW9XaUR9', '_blank')}
            >
              Contact (Discord)
            </Button>
            <Button
              className="bg-gradient-primary text-white glow-primary mobile-btn-text"
              onClick={() => window.open('https://ai.cyoda.net', '_blank')}
            >
              Try Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
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
            <nav className="space-y-2">
              <Link to="/products" className="block py-2 text-foreground hover:text-primary transition-colors">Products</Link>
              <Link to="/pricing" className="block py-2 text-foreground hover:text-primary transition-colors">Pricing</Link>
              <div className="py-2">
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors min-h-[44px]">
                  <span>Docs</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="ml-4 mt-2 space-y-1">
                  <Link to="/guides" className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">Guides</Link>
                  <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">Application Documentation</a>
                  <span className="block py-1 text-sm text-muted-foreground">Video Explanations (coming soon)</span>
                </div>
              </div>
              <Link to="/blog" className="block py-2 text-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/support" className="block py-2 text-foreground hover:text-primary transition-colors">Support</Link>
            </nav>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
              <Button variant="ghost" className="justify-start mobile-btn-text">
                Contact (Discord)
              </Button>
              <Button
                className="bg-gradient-primary text-white justify-start mobile-btn-text"
                onClick={() => window.open('https://ai.cyoda.net', '_blank')}
              >
                Try Now
              </Button>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg hover:bg-secondary glow-hover transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;