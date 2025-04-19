import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
}

export const SEO = ({
  title = 'Educite Virtual Library',
  description = 'Your comprehensive legal resource hub. Access thousands of documents instantly.',
  keywords = 'virtual library, educational documents, e-documents, legal resources, academic materials',
  image = '/assets/imgs/educite-logo.png',
  url = 'https://educitevl.edu.ug/',
  type = 'website',
  canonicalUrl
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Add canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Add language tag */}
      <html lang="en" />
      
      {/* Add mobile viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Add additional crawling hints */}
      {type === 'article' && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
    </Helmet>
  );
};