import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
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
    { icon: Linkedin, href: 'https://www.linkedin.com/company/cyoda', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/cyodaops', label: 'X (Twitter)' },
    { icon: Youtube, href: 'https://www.youtube.com/@cyoda934', label: 'YouTube' },
    { icon: Github, href: 'https://github.com/Cyoda-platform/', label: 'GitHub' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 glow-hover">
            <img src={cyodaLogo} alt="Cyoda" className="h-10" />
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
                  <NavigationMenuLink className="text-sm hover:text-primary transition-colors">
                    Application Documentation
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm hover:text-primary transition-colors">
                    How-To Guides
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
                className="p-2 rounded-lg hover:bg-secondary glow-hover transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <ThemeToggle />

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" className="glow-hover">
              Contact (Discord)
            </Button>
            <Button 
              className="bg-gradient-primary text-white glow-primary" 
              onClick={() => window.open('https://ai.cyoda.net', '_blank')}
            >
              Try Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                  <span>Docs</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="ml-4 mt-2 space-y-1">
                  <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">Application Documentation</a>
                  <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">How-To Guides</a>
                  <span className="block py-1 text-sm text-muted-foreground">Video Explanations (coming soon)</span>
                </div>
              </div>
              <Link to="/blog" className="block py-2 text-foreground hover:text-primary transition-colors">Blog</Link>
              <Link to="/support" className="block py-2 text-foreground hover:text-primary transition-colors">Support</Link>
            </nav>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
              <Button variant="ghost" className="justify-start">
                Contact (Discord)
              </Button>
              <Button 
                className="bg-gradient-primary text-white justify-start"
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
                  className="p-2 rounded-lg hover:bg-secondary glow-hover transition-all"
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