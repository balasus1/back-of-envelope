'use client';

import { useState } from 'react';
import { Cloud, Search, HelpCircle, CheckCircle2, Server } from 'lucide-react';

export default function CloudMappingPage() {
  const [search, setSearch] = useState('');

  const mapping = [
    { component: 'DNS Resolution', aws: 'Route53', gcp: 'Cloud DNS', azure: 'Azure DNS', vps: 'BIND / PowerDNS / CoreDNS', notes: 'Anycast latency routing & health checks' },
    { component: 'Content Delivery Network (CDN)', aws: 'CloudFront', gcp: 'Cloud CDN', azure: 'Azure CDN', vps: 'Cloudflare / Fastly', notes: 'Edge PoPs for static caching and TLS offload' },
    { component: 'Web Application Firewall (WAF)', aws: 'AWS WAF', gcp: 'Cloud Armor', azure: 'Azure WAF', vps: 'ModSecurity + Coraza Nginx', notes: 'L7 rate limiting, SQLi, bot mitigation' },
    { component: 'Load Balancer Layer 4', aws: 'Network Load Balancer (NLB)', gcp: 'TCP Proxy LB', azure: 'Azure LB', vps: 'HAProxy / Nginx Stream', notes: 'SYN-flood absorption, raw TCP passthrough' },
    { component: 'Load Balancer Layer 7', aws: 'Application Load Balancer (ALB)', gcp: 'HTTP(S) Load Balancer', azure: 'App Gateway', vps: 'Traefik / Envoy / Nginx', notes: 'HTTP/2, gRPC path-based routing' },
    { component: 'API Gateway', aws: 'Amazon API Gateway', gcp: 'Apigee / API Gateway', azure: 'API Management (APIM)', vps: 'Kong / KrakenD / Envoy', notes: 'Rate limiting token bucket, JWT verification' },
    { component: 'Container Orchestration', aws: 'EKS', gcp: 'GKE', azure: 'AKS', vps: 'K3s / kubeadm / Nomad', notes: 'Kubernetes multi-AZ pod scheduling' },
    { component: 'Service Mesh', aws: 'App Mesh', gcp: 'Anthos Service Mesh', azure: 'Open Service Mesh', vps: 'Istio / Linkerd', notes: 'mTLS, circuit breaking, distributed tracing' },
    { component: 'Message Queue / Event Bus', aws: 'Amazon MSK (Kafka)', gcp: 'Pub/Sub or Confluent Cloud', azure: 'Event Hubs', vps: 'Kafka on Bare Metal / Strimzi', notes: 'KRaft event streaming with partition ordering' },
    { component: 'Database (OLTP Relational)', aws: 'Amazon RDS / Aurora PG', gcp: 'Cloud SQL / AlloyDB', azure: 'Azure Database for PostgreSQL', vps: 'PostgreSQL + Patroni', notes: 'ACID transactions, read replicas' },
    { component: 'Database (NoSQL Document/KV)', aws: 'DynamoDB', gcp: 'Firestore / Bigtable', azure: 'Cosmos DB', vps: 'Cassandra / MongoDB / ScyllaDB', notes: 'Single-digit ms key-value lookups' },
    { component: 'In-Memory Cache', aws: 'ElastiCache (Redis)', gcp: 'Memorystore', azure: 'Azure Cache for Redis', vps: 'Redis Sentinel / Dragonfly', notes: 'Sub-millisecond session & catalog cache' },
    { component: 'Object Storage', aws: 'Amazon S3', gcp: 'Google Cloud Storage (GCS)', azure: 'Blob Storage', vps: 'MinIO / Ceph', notes: 'Immutable asset blobs, backups, logs' },
    { component: 'Search & Analytics Engine', aws: 'Amazon OpenSearch', gcp: 'Elastic Cloud on GCP', azure: 'Azure Cognitive Search', vps: 'Elasticsearch / OpenSearch', notes: 'Full-text faceted product catalog search' },
    { component: 'Metrics Monitoring', aws: 'Amazon CloudWatch', gcp: 'Cloud Monitoring', azure: 'Azure Monitor', vps: 'Prometheus + VictoriaMetrics', notes: 'Time-series telemetry & SLO dashboards' },
    { component: 'Log Management', aws: 'CloudWatch Logs', gcp: 'Cloud Logging', azure: 'Log Analytics', vps: 'Grafana Loki / Vector', notes: 'Centralized structured log ingestion' },
    { component: 'Distributed Tracing', aws: 'AWS X-Ray', gcp: 'Cloud Trace', azure: 'Application Insights', vps: 'Jaeger / Grafana Tempo', notes: 'W3C trace context end-to-end propagation' },
    { component: 'Secrets & Key Management', aws: 'Secrets Manager / KMS', gcp: 'Secret Manager / Cloud KMS', azure: 'Azure Key Vault', vps: 'HashiCorp Vault', notes: 'Database credential rotation & master keys' },
    { component: 'CI/CD Pipelines', aws: 'AWS CodePipeline', gcp: 'Cloud Build', azure: 'Azure DevOps Pipelines', vps: 'GitLab CI / GitHub Actions', notes: 'Automated canary & rolling deployments' },
    { component: 'Identity & Access (IAM)', aws: 'AWS IAM / Cognito', gcp: 'Cloud IAM / Identity Platform', azure: 'Microsoft Entra ID', vps: 'Keycloak / Ory Kratos', notes: 'OAuth2 / OIDC authentication tokens' },
    { component: 'Serverless Functions', aws: 'AWS Lambda', gcp: 'Cloud Functions', azure: 'Azure Functions', vps: 'OpenFaaS / Knative', notes: 'Event-driven asynchronous webhooks' },
    { component: 'Virtual Machine Infrastructure', aws: 'Amazon EC2', gcp: 'Compute Engine (GCE)', azure: 'Azure Virtual Machines', vps: 'Hetzner / DigitalOcean / Linode', notes: 'General compute instance tier' },
  ];

  const filteredMapping = mapping.filter(
    (m) =>
      m.component.toLowerCase().includes(search.toLowerCase()) ||
      m.aws.toLowerCase().includes(search.toLowerCase()) ||
      m.gcp.toLowerCase().includes(search.toLowerCase()) ||
      m.azure.toLowerCase().includes(search.toLowerCase()) ||
      m.vps.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d0e15] p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Sheet 14
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Cloud Provider Equivalence Matrix</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Component-by-component cross-cloud mapping: AWS vs Google Cloud (GCP) vs Microsoft Azure vs Self-Hosted / VPS.
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search cloud services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-black/40 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
      </div>

      {/* FAANG Interview Strategy Tip */}
      <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs text-zinc-300 flex items-start gap-3">
        <HelpCircle size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white font-mono uppercase text-[11px]">FAANG Interview Best Practice:</strong>
          <p className="leading-relaxed text-zinc-300">
            Default to <strong>AWS terminology</strong> in FAANG interviews unless the interviewer explicitly asks for GCP or Azure. AWS has the widest recognition and standardized service limits (e.g. NLB vs ALB, MSK, RDS Aurora, S3, ElastiCache). If the prompt mentions GCP BigQuery or Spanner, pivot fluidly using the equivalents below.
          </p>
        </div>
      </div>

      {/* Cross Cloud Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1017] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/50 text-zinc-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Component</th>
                <th className="py-3 px-3 font-semibold text-amber-300">AWS (Default)</th>
                <th className="py-3 px-3 font-semibold text-blue-300">Google Cloud (GCP)</th>
                <th className="py-3 px-3 font-semibold text-cyan-300">Microsoft Azure</th>
                <th className="py-3 px-3 font-semibold text-zinc-400">Self-Hosted / VPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {filteredMapping.map((row) => (
                <tr key={row.component} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-medium text-white">
                    <div>{row.component}</div>
                    <span className="text-[10px] text-zinc-500">{row.notes}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-200/90 font-medium">{row.aws}</td>
                  <td className="py-3 px-3 font-mono text-blue-200/90">{row.gcp}</td>
                  <td className="py-3 px-3 font-mono text-cyan-200/90">{row.azure}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400">{row.vps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}