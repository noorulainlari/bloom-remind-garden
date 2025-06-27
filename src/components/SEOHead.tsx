
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SEOHead = () => {
  const location = useLocation();

  useEffect(() => {
    // Base meta tags
    const defaultTitle = "Plant Water Reminder – Care Tracker for Your Plants";
    const defaultDescription = "Free online plant watering reminder tool. Set reminders for indoor plants, succulents, herbs, and more. Upload photos, get email alerts, and grow a healthy garden.";
    const defaultImage = "https://plantwaterreminder.com/og-image.jpg";

    // Update title based on route
    let title = defaultTitle;
    let description = defaultDescription;

    switch (location.pathname) {
      case '/gallery':
        title = "Plant Gallery – Beautiful Plant Photos | Plant Water Reminder";
        description = "Browse beautiful plant photos shared by our community. Get inspiration for your own plant collection and care tips.";
        break;
      case '/blog':
        title = "Plant Care Blog – Tips & Guides | Plant Water Reminder";
        description = "Expert plant care tips, watering guides, and growing advice. Learn how to keep your plants healthy and thriving.";
        break;
      case '/about':
        title = "About Us – Plant Water Reminder Tool";
        description = "Learn about our mission to help plant lovers keep their green friends healthy with smart watering reminders and care tracking.";
        break;
      case '/contact':
        title = "Contact Us – Plant Water Reminder Support";
        description = "Get in touch with our plant care team. Questions, feedback, or suggestions welcome.";
        break;
    }

    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Plant Water Reminder",
      "description": description,
      "url": "https://plantwaterreminder.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "Plant Water Reminder"
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [location.pathname]);

  return null;
};
