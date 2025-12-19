import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Investors = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the static HTML content
    fetch('/investors/index.html')
      .then(response => response.text())
      .then(html => {
        // Extract the body content and styles
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get the body content (everything except nav and footer)
        const body = doc.body;
        const nav = body.querySelector('nav');
        const footer = body.querySelector('footer');

        // Remove nav and footer from the content
        if (nav) nav.remove();
        if (footer) footer.remove();

        // Get the styles
        const styles = doc.querySelector('style')?.innerHTML || '';

        // Combine styles and content
        setHtmlContent(`<style>${styles}</style>${body.innerHTML}`);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading investors content:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Cyoda | Investor Relations</title>
        <meta name="description" content="Cyoda Investor Relations - The first AI-Operable Application Platform built for mission-critical financial systems." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-muted-foreground">Loading investor information...</p>
            </div>
          ) : (
            <div
              className="investors-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Investors;
