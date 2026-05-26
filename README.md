# Calisteniapp 3D 🚀

Entrenador interactivo de calistenia en 3D optimizado para `calisteniapp.cl`.

## Características
- **Escena 3D Interactiva**: Visualiza el cuerpo humano y sus músculos.
- **Enfoque en Calistenia**: Ejercicios específicos de peso corporal.
- **SEO Premium**: Optimizado para Google con meta tags, JSON-LD, sitemap y robots.txt.
- **Diseño Glassmorphism**: Interfaz moderna y profesional.

## Cómo desplegar en GitHub Pages

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar el dominio**:
   En el archivo `public/CNAME` (si no existe, créalo), agrega:
   ```
   calisteniapp.cl
   ```

3. **Desplegar**:
   ```bash
   npm run deploy
   ```

## Optimización SEO
Para mantener el **Top 1 en Google**:
- Asegúrate de que el título en `index.html` sea siempre descriptivo.
- El archivo `sitemap.xml` debe estar actualizado si agregas nuevas páginas.
- El componente `src/components/SEO.jsx` contiene los datos estructurados que Google lee para mostrar resultados enriquecidos.

## Tecnologías
- React + Vite
- Three.js (React Three Fiber)
- Tailwind CSS
- Lucide React (Iconos)
- Zustand (Estado)
