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
    <div className="w-56 bg-[#ebebeb] border-r border-[#d4d4d4] h-screen overflow-y-auto flex-shrink-0 shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
      <div className="p-3 border-b border-[#d4d4d4] bg-[#e0e0e0]">
        <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">System Design Studio</h1>
        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider font-sans">Interview Calculator</p>
      </div>
      <nav className="p-1 space-y-[2px]">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={clsx(
              'block px-2 py-1.5 rounded text-[13px] transition-colors font-medium',
              pathname === route.path
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-700 hover:bg-[#dcdcdc] hover:text-gray-900'
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-[#d4d4d4] mt-auto">
        <div className="text-[10px] text-gray-500 font-sans leading-tight">
          <strong>Tip:</strong> Hover over any calculated metric to see its derivation and dependencies.
        </div>
      </div>
    </div>
  );
}
