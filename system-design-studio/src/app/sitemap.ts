import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://systemdesign.balashan.dev';
  const currentDate = new Date().toISOString();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/studio', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/rubric', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/metrics', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/reference', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/architecture', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/cost', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/kafka', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/db', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/cache', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/gateway', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/lb', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/backend', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/frontend', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/dlq', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/cloud', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/concepts', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/infra', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/latency', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/observability', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/practice', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/spikes', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/summary', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/whiteboard', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
