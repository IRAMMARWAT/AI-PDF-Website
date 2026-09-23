import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export function SEOHead({ title, description, canonicalUrl, schema }: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) ogTitle.content = title;

    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDesc) ogDesc.content = description;

    // Update or create canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonicalUrl;
    }

    // Inject JSON-LD Schema
    let scriptTag = document.getElementById('docunova-schema-jsonld') as HTMLScriptElement;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'docunova-schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, schema]);

  return null;
}
