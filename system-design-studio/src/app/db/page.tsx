'use client';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';

export default function Page() {
  const { derivations } = useStore();
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 border-b-2 border-gray-300 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight capitalize">Database Design</h1>
        <p className="text-xs text-gray-600 font-sans">PostgreSQL QPS, IOPS, and storage.</p>
      </div>
      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-6 space-y-4 font-sans">
        <div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Raw DB QPS</span>
          <Metric name="Raw DB QPS" metric={derivations.dbQps} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Actual Disk QPS (post-cache)</span>
          <Metric name="Actual Disk QPS (post-cache)" metric={derivations.actualDbQps} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">IOPS Required</span>
          <Metric name="IOPS Required" metric={derivations.dbIops} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Hot Data Storage (GB)</span>
          <Metric name="Hot Data Storage (GB)" metric={derivations.hotDataGb} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Total Storage w/ Indexes & WAL</span>
          <Metric name="Total Storage w/ Indexes & WAL" metric={derivations.totalDbStorage} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Read Replicas</span>
          <Metric name="Read Replicas" metric={derivations.dbReplicas} />
        </div>
      </div>
    </div>
  );
}