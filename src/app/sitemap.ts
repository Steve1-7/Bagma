import type { MetadataRoute } from 'next';

const publicRoutes = [
  '/',
  '/about',
  '/menu',
  '/order',
  '/carwash',
  '/events',
  '/promotions',
  '/gallery',
  '/reviews',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}