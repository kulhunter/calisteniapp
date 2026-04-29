import React from 'react';

export function SEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calisteniapp Pro",
    "url": "https://calisteniapp.cl",
    "description": "Plataforma Pro de Calistenia. Rutinas guiadas, cronómetros y técnica avanzada.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web"
  };

  React.useEffect(() => {
    document.title = "Calisteniapp Pro - Entrena como un Guerrero";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "La aplicación definitiva de calistenia. Rutinas guiadas y cronómetros Pro.");
  }, []);

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}
