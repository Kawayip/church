import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getOptimizedImageUrl, getDefaultLogoUrl } from '../utils/imageUtils';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  twitterSite?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Mt. Olives SDA Church - Naalya, Uganda',
  description = 'A vibrant Seventh-day Adventist community in Naalya, dedicated to worship, fellowship, and service. Join us as we grow together in faith and love.',
  image = '/images/logos/church-logo.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Mt. Olives SDA Church',
  section,
  tags = [],
  siteName = 'Mt. Olives SDA Church',
  twitterCard = 'summary_large_image',
  twitterCreator = '@mtolivessda',
  twitterSite = '@mtolivessda',
  canonicalUrl,
  noIndex = false,
  noFollow = false,
}) => {
  // Get current URL if not provided
  const currentUrl = url || window.location.href;
  const fullCanonicalUrl = canonicalUrl || currentUrl;
  
  // Ensure image URL is absolute and optimized for social media
  const socialImageUrl = image ? getOptimizedImageUrl(image) : getDefaultLogoUrl();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots Meta */}
      {noIndex && <meta name="robots" content="noindex" />}
      {noFollow && <meta name="robots" content="nofollow" />}
      {noIndex && noFollow && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, etc.) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:updated_time" content={modifiedTime || new Date().toISOString()} />
      
      {/* Open Graph Article Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && (
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:site" content={twitterSite} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3f7f8c" />
      <meta name="msapplication-TileColor" content="#3f7f8c" />
      
      {/* WhatsApp and messaging platform specific meta tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Additional Open Graph tags for better social media sharing */}
      <meta property="og:image:secure_url" content={socialImageUrl.replace(/^http:/, 'https:')} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Structured Data for Events */}
      {type === 'event' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": title,
            "description": description,
            "image": socialImageUrl,
            "url": currentUrl,
            "organizer": {
              "@type": "Organization",
              "name": "Mt. Olives SDA Church",
              "url": "https://mtolivessda.org"
            },
            "startDate": publishedTime,
            "endDate": modifiedTime
          })}
        </script>
      )}
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mt. Olives SDA Church",
          "url": "https://mtolivessda.org",
          "logo": `${window.location.origin}/images/logos/church-logo.png`,
          "image": socialImageUrl,
          "description": "A vibrant Seventh-day Adventist community in Naalya, dedicated to worship, fellowship, and service.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Naalya",
            "addressCountry": "Uganda"
          },
          "sameAs": [
            "https://www.youtube.com/@mtolivessda",
            "https://www.facebook.com/mtolivessda"
          ]
        })}
      </script>
    </Helmet>
  );
};

// Predefined SEO configurations for different page types
export const SEOConfigs = {
  home: {
    title: 'Mt. Olives SDA Church - Naalya, Uganda',
    description: 'A vibrant Seventh-day Adventist community in Naalya, dedicated to worship, fellowship, and service. Join us as we grow together in faith and love.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  about: {
    title: 'About Us - Mt. Olives SDA Church',
    description: 'Learn about our history, mission, and the beliefs that guide our community as we serve God and our neighbors in Naalya.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  events: {
    title: 'Events - Mt. Olives SDA Church',
    description: 'Stay updated with our upcoming events, services, and community activities at Mt. Olives SDA Church.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  ministries: {
    title: 'Ministries - Mt. Olives SDA Church',
    description: 'Discover the various ministries at Mt. Olives and find your place to serve, grow, and connect with our church family.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  resources: {
    title: 'Resources - Mt. Olives SDA Church',
    description: 'Access study materials, sermons, and spiritual resources to help you grow in your faith journey.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  contact: {
    title: 'Contact Us - Mt. Olives SDA Church',
    description: 'Get in touch with Mt. Olives SDA Church. We\'d love to hear from you and answer any questions you may have.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
  
  live: {
    title: 'Live Stream - Mt. Olives SDA Church',
    description: 'Watch our live services and join our online community. Experience the worship and fellowship of Mt. Olives SDA Church from anywhere.',
    image: '/images/logos/church-logo.png',
    type: 'website' as const,
  },
}; 