'use client';
import { useStore } from '../../lib/store';
import { Metric } from '../../components/Metric';

export default function Page() {
  const { derivations } = useStore();
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 border-b-2 border-gray-300 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 font-serif tracking-tight capitalize">Kafka Design</h1>
        <p className="text-xs text-gray-600 font-sans">Brokers, partitions, KRaft sizing.</p>
      </div>
      <div className="bg-[#fcfcfc] border border-[#d4d4d4] rounded shadow-sm p-6 space-y-4 font-sans">
        <div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Kafka Throughput (MB/s)</span>
          <Metric name="Kafka Throughput (MB/s)" metric={derivations.kafkaMbs} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Internal Replication (MB/s)</span>
          <Metric name="Internal Replication (MB/s)" metric={derivations.kafkaInternalMbs} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Total Partitions</span>
          <Metric name="Total Partitions" metric={derivations.kafkaPartitions} />
        </div><div className="flex justify-between items-center border-b border-[#eee] pb-2">
          <span className="text-[13px] font-semibold text-gray-700">Total Brokers</span>
          <Metric name="Total Brokers" metric={derivations.kafkaBrokers} />
        </div>
      </div>
    </div>
  );
}