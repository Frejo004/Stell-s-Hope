import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

export default function SEO({
  title,
  description = "Découvrez la Maison Stell's Hope, l'excellence de la haute couture contemporaine et du prêt-à-porter de luxe. Pièces exclusives, matières d'exception et confection soignée.",
  image = "/og-image.jpg",
  url,
  type = 'website'
}: SEOProps) {
  useEffect(() => {
    // 1. Titre de la page
    const fullTitle = title ? `${title} — Stell's Hope` : "Stell's Hope | Maison de Haute Couture & Élégance Contemporaine";
    document.title = fullTitle;

    // Helper pour mettre à jour ou créer une balise meta
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper pour canonical
    const currentUrl = url || window.location.href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 2. Meta description
    setMetaTag('name', 'description', description);

    // 3. OpenGraph (Facebook, WhatsApp, LinkedIn, etc.)
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:site_name', "Stell's Hope Haute Couture");

    // 4. Twitter Card (X)
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

  }, [title, description, image, url, type]);

  return null;
}
