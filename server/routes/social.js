const express = require('express');
const router = express.Router();
const { pool } = require('../database/connection');
const { cleanHtmlText } = require('../utils/textUtils');

// Generate social media metadata HTML
function generateSocialMetaHTML(data) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Mt. Olives SDA Church',
    siteName = 'Mt. Olives SDA Church'
  } = data;

  // Ensure image URL is absolute
  const fullImageUrl = image && image.startsWith('http') 
    ? image 
    : image 
      ? `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}${image}`
      : `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/images/logos/church-logo.png`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="author" content="${author}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, etc.) -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${fullImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:updated_time" content="${modifiedTime || new Date().toISOString()}" />
    <meta property="og:image:secure_url" content="${fullImageUrl.replace(/^http:/, 'https:')}" />
    <meta property="og:image:type" content="image/jpeg" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${fullImageUrl}" />
    <meta name="twitter:image:alt" content="${title}" />
    <meta name="twitter:creator" content="@mtolivessda" />
    <meta name="twitter:site" content="@mtolivessda" />
    
    <!-- Additional Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#3f7f8c" />
    <meta name="msapplication-TileColor" content="#3f7f8c" />
    
    <!-- WhatsApp and messaging platform specific meta tags -->
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${siteName}" />
    
    <!-- Structured Data for Events -->
    ${type === 'event' ? `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "${title}",
      "description": "${description}",
      "image": "${fullImageUrl}",
      "url": "${url}",
      "organizer": {
        "@type": "Organization",
        "name": "Mt. Olives SDA Church",
        "url": "https://mtolivessda.org"
      },
      "startDate": "${publishedTime || ''}",
      "endDate": "${modifiedTime || ''}"
    }
    </script>
    ` : ''}
    
    <!-- Structured Data for Organization -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Mt. Olives SDA Church",
      "url": "https://mtolivessda.org",
      "logo": "${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/images/logos/church-logo.png",
      "image": "${fullImageUrl}",
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
    }
    </script>
    
    <!-- Redirect to actual page after a short delay -->
    <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
            <h1>${title}</h1>
            <p>${description}</p>
            <p>Redirecting to <a href="${url}">${url}</a>...</p>
        </div>
    </div>
</body>
</html>`;
}

// Route for event social media metadata
router.get('/event/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    const [events] = await pool.execute(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).send('Event not found');
    }

    const event = events[0];
    const cleanDescription = cleanHtmlText(event.description || '', 160);
    
    const metadata = {
      title: event.title,
      description: cleanDescription,
      image: event.image_name ? `${process.env.BACKEND_URL || 'https://mtolivesdachurch.com'}/api/events/${eventId}/image` : `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/images/logos/church-logo.png`,
      url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/events/${eventId}`,
      type: 'event',
      publishedTime: event.event_date,
      modifiedTime: event.updated_at,
      author: 'Mt. Olives SDA Church'
    };

    const html = generateSocialMetaHTML(metadata);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Error generating event metadata:', error);
    res.status(500).send('Internal server error');
  }
});

// Route for post social media metadata
router.get('/post/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).send('Post not found');
    }

    const post = posts[0];
    const cleanDescription = cleanHtmlText(post.excerpt || post.content || '', 160);
    
    const metadata = {
      title: post.title,
      description: cleanDescription,
      image: post.featured_image_name ? `${process.env.BACKEND_URL || 'https://mtolivesdachurch.com'}/api/posts/${postId}/image` : `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/images/logos/church-logo.png`,
      url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/posts/${postId}`,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      author: `${post.first_name || ''} ${post.last_name || ''}`.trim() || 'Mt. Olives SDA Church'
    };

    const html = generateSocialMetaHTML(metadata);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Error generating post metadata:', error);
    res.status(500).send('Internal server error');
  }
});

// Route for general page social media metadata
router.get('/page/:type', async (req, res) => {
  try {
    const pageType = req.params.type;
    
    const pageConfigs = {
      home: {
        title: 'Mt. Olives SDA Church - Naalya, Uganda',
        description: 'A vibrant Seventh-day Adventist community in Naalya, dedicated to worship, fellowship, and service. Join us as we grow together in faith and love.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}`,
        type: 'website'
      },
      about: {
        title: 'About Us - Mt. Olives SDA Church',
        description: 'Learn about our history, mission, and the beliefs that guide our community as we serve God and our neighbors in Naalya.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/about`,
        type: 'website'
      },
      events: {
        title: 'Events - Mt. Olives SDA Church',
        description: 'Stay updated with our upcoming events, services, and community activities at Mt. Olives SDA Church.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/events`,
        type: 'website'
      },
      ministries: {
        title: 'Ministries - Mt. Olives SDA Church',
        description: 'Discover the various ministries at Mt. Olives and find your place to serve, grow, and connect with our church family.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/ministries`,
        type: 'website'
      },
      resources: {
        title: 'Resources - Mt. Olives SDA Church',
        description: 'Access study materials, sermons, and spiritual resources to help you grow in your faith journey.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/resources`,
        type: 'website'
      },
      contact: {
        title: 'Contact Us - Mt. Olives SDA Church',
        description: 'Get in touch with Mt. Olives SDA Church. We\'d love to hear from you and answer any questions you may have.',
        image: '/images/logos/church-logo.png',
        url: `${process.env.FRONTEND_URL || 'https://mtolivesdachurch.com'}/contact`,
        type: 'website'
      }
    };

    const config = pageConfigs[pageType];
    if (!config) {
      return res.status(404).send('Page not found');
    }

    const html = generateSocialMetaHTML(config);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Error generating page metadata:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
