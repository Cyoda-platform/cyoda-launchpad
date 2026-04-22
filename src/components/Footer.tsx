import { Link } from 'react-router-dom';
import { SiGithub, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import cyodaLogo from '@/assets/cyoda-logo.png';
import { useState } from 'react';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';

const Footer = () => {
  const [prefsOpen, setPrefsOpen] = useState(false);

  const platformLinks = [
    { name: 'Use Cases', href: '/use-cases' },
    { name: 'Docs', href: 'https://docs.cyoda.net/', external: true },
    { name: 'Blog', href: '/blog' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ];

  const cyodaWebLinks = [
    { name: 'Enterprise Cyoda', href: '/' },
    { name: 'Cyoda Cloud', href: 'https://ai.cyoda.net/', external: true },
    { name: 'Open Source', href: 'https://cyoda.org', external: true },
    { name: 'Docs', href: 'https://docs.cyoda.net', external: true },
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
    <footer className="border-t border-border bg-[hsl(var(--section-alt-bg))]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">

                <img src={cyodaLogo} alt="Cyoda" className="h-6 sm:h-6" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Enterprise Cyoda — commercially supported EDBMS for stateful, auditable, workflow-driven systems.
              In production in European private-debt markets since 2017.
            </p>

            {/* Social links with neon glow */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-secondary border border-border ${social.hoverColor} hover:border-border/80 transition-all duration-200 group`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <nav className="space-y-3">
              {platformLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
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

          {/* Company links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <nav className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Cyoda web estate links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Cyoda</h3>
            <nav className="space-y-3">
              {cyodaWebLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
