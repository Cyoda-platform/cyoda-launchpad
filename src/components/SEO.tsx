import React from 'react';
import { Helmet } from 'react-helmet-async';
import { resolveAppAssetUrl, toAbsoluteUrl } from '@/lib/utils';

interface SEOProps {
  title: string;
  description: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
  twitterHandle?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  image,
  url,
  type = 'article',
  siteName = 'Cyoda',
  twitterHandle = '@cyodaops'
}) => {
  const fullTitle = `${title} | ${siteName}`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const resolvedImage = resolveAppAssetUrl(image);
  const defaultImage = toAbsoluteUrl(resolvedImage) || 'https://lovable.dev/opengraph-image-p98pqg.png';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {defaultImage && <meta property="og:image" content={defaultImage} />}
      {defaultImage && <meta property="og:image:alt" content={title} />}
      
      {/* Article-specific Open Graph tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {defaultImage && <meta name="twitter:image" content={defaultImage} />}
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* JSON-LD Structured Data */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "author": {
              "@type": "Person",
              "name": author || "Cyoda Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": siteName,
              "logo": {
                "@type": "ImageObject",
                "url": "https://lovable.dev/opengraph-image-p98pqg.png"
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "image": defaultImage,
            "url": currentUrl,
            "keywords": tags.join(', ')
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
