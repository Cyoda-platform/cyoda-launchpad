import { Link } from 'react-router-dom';
import { SiGithub, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import cyodaLogo from '@/assets/cyoda-logo.png';
import { HashLink } from "react-router-hash-link";
import { useState } from 'react';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';

const Footer = () => {
  const [prefsOpen, setPrefsOpen] = useState(false);

  const footerLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '#' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/support' },
  ];

  const socialLinks = [
    {
      icon: SiLinkedin,
      href: 'https://www.linkedin.com/company/cyoda',
      label: 'LinkedIn',
      hoverColor: 'hover:text-blue-400'
    },
    {
      icon: SiX,
      href: 'https://twitter.com/cyodaops',
      label: 'X (Twitter)',
      hoverColor: 'hover:text-blue-400'
    },
    {
      icon: SiYoutube,
      href: 'https://www.youtube.com/@cyoda934',
      label: 'YouTube',
      hoverColor: 'hover:text-red-400'
    },
    {
      icon: SiGithub,
      href: 'https://github.com/Cyoda-platform/',
      label: 'GitHub',
      hoverColor: 'hover:text-gray-300'
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">

                <img src={cyodaLogo} alt="Cyoda" className="h-6 sm:h-6" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Developer-first application platform with AI builder.
              Turn problems into scalable, enterprise-grade systems in minutes.
            </p>

            {/* Social links with neon glow */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-card/20 border border-border/50 ${social.hoverColor} glow-hover transition-all duration-300 group`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <nav className="space-y-3">
              {footerLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Get In Touch</h3>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Join our community on Discord for support and discussions.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Contact via Discord
              </a>
<p/>
            </div>
              <div className="space-y-3">
                  <p className="text-muted-foreground">
                      Send us a message
                  </p>
                  <HashLink smooth to="/support#contact" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
                      Contact Form
                  </HashLink>
              </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Cyoda. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setPrefsOpen(true)}
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Cookie Preferences
            </button>

            <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Cookie Policy
            </Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <CookiePreferencesModal open={prefsOpen} onOpenChange={setPrefsOpen} />

      </div>
    </footer>
  );
};

export default Footer;