'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhiteboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/rubric');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
      Redirecting to System Design Rubric & Checklist...
    </div>
  );
}