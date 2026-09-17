import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bagma Lifestyle',
    short_name: 'Bagma',
    description: 'Chisanyama, carwash and lifestyle experiences.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#050505',
    theme_color: '#E10600',
    icons: [
      { src: '/logo5.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo5.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}