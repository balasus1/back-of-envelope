'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const routes = [
  { name: '1. Control Panel', path: '/' },
  { name: '2. User Metrics', path: '/metrics' },
  { name: '3. Frontend & CDN', path: '/frontend' },
  { name: '4. API Gateway & Edge', path: '/gateway' },
  { name: '5. Load Balancer', path: '/lb' },
  { name: '6. Backend Services', path: '/backend' },
  { name: '7. Network Latency', path: '/latency' },
  { name: '8. Kafka Design', path: '/kafka' },
  { name: '9. Database Design', path: '/db' },
  { name: '10. Cache (Redis)', path: '/cache' },
  { name: '11. DLQ & Error Handling', path: '/dlq' },
  { name: '12. Traffic Spikes & DDoS', path: '/spikes' },
  { name: '13. Observability', path: '/observability' },
  { name: '14. Cloud Provider Mapping', path: '/cloud' },
  { name: '15. Cloud Infra Picker', path: '/infra' },
  { name: '16. Cost Estimator', path: '/cost' },
  { name: '17. Final Summary Cheat-Sheet', path: '/summary' },
  { name: '18. Interview Practice', path: '/practice' },
  { name: '19. Architecture Diagram', path: '/architecture' },
  { name: '20. Whiteboard Canvas', path: '/whiteboard' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white leading-tight">System Design<br/>Studio</h1>
      </div>
      <nav className="p-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={clsx(
              'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === route.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
