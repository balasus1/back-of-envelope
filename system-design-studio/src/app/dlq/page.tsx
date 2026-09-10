'use client';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';

export default function Page() {
  const { derivations } = useStore();
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 border-b-2 border-gray-300 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight capitalize">DLQ & Error Handling</h1>
        <p className="text-xs text-gray-600 font-sans">Retry backoff and reprocessing logic.</p>
      </div>
      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-6 space-y-4 font-sans">
        <div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Total Retry Time (s)</span>
          <Metric name="Total Retry Time (s)" metric={derivations.retryTime} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Daily Messages to DLQ</span>
          <Metric name="Daily Messages to DLQ" metric={derivations.dlqMsgs} />
        </div>
      </div>
    </div>
  );
}