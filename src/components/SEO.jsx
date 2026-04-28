import React from 'react';

export function SEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calisteniapp",
    "url": "https://calisteniapp.cl",
    "description": "Entrenador 3D interactivo para calistenia y fitness. Visualiza la técnica correcta de ejercicios con un modelo anatómico.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Organization",
      "name": "Calisteniapp"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CLP"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}
