# PROMPT FOR ANTIGRAVITY IDE

Copy everything below the line into Antigravity as a single task.

---

You are a Principal Frontend Architect. Build a production-quality, single-page **React + TypeScript** web app called **"System Design Studio"** — my single point of reference for practicing FAANG-style system design interviews, both "in hand" (mental math) and "on the calculator" (live model). It replaces an Excel workbook (`System_Design_Master_Calculator.xlsx`) that models an Amazon/Flipkart-scale e-commerce platform end-to-end: client → CDN → Gateway → Microservices → Kafka → DB → Cache → DLQ → Reprocessing → Observability → Cost.

## 1. Tech stack (non-negotiable)

- **Next.js 14+ (App Router)**, TypeScript, TailwindCSS
- **Zustand** (or Jotai) for global state — one store holds every input, and all derived values are computed selectors/memoized functions off that store. No component holds its own copy of a calculated number.
- **React Table (TanStack Table v8)** for every tabular/comparison view
- **Mermaid.js** (`mermaid` npm package, rendered client-side, re-rendered reactively when the underlying data changes) for the architecture / sequence / flow diagrams
- **React Flow (`@xyflow/react`)** for the drag-and-drop whiteboard — draggable component nodes (CDN, Gateway, LB, Service, Kafka, DB, Cache, DLQ, etc.), connectable edges with labels (protocol, latency, async/sync), a component palette sidebar, and the ability to save/load a canvas layout as JSON
- **Recharts** for the latency waterfall, cost breakdown pie, and throughput-vs-partitions sensitivity charts
- Deployable on **Vercel**, no backend required — everything runs client-side; persist state to `localStorage` so a session survives a refresh
- Clean, accessible, keyboard-navigable UI; dark mode by default with a light-mode toggle

## 2. Core principle: ONE calculation engine, everywhere derived

Model this exactly like the Excel workbook's named-range architecture:

- A single `inputs` object (Zustand store) holding every "Master Input" below, grouped into blocks (A–L, same grouping as listed in section 4).
- A `derivations.ts` module of **pure functions**, one per calculated metric, each taking `inputs` (and sometimes other derived values) and returning `{ value, unit, formulaText, humanExplanation, dependsOn: string[] }`. Every calculated metric in the app must be produced by one of these functions — never hardcode a number in a component.
- A **Scenario selector** (Normal / Flash Sale / Black Friday / Cyber Monday / DDoS) that overrides `DAU_PCT`, `PEAK_CONCURRENT_PCT`, and `SPIKE_MULTIPLIER` via a lookup table, exactly like the Excel `INDEX/MATCH` against a hidden scenarios sheet. Changing the scenario must instantly recompute and re-render every screen, chart, table, and diagram.
- Build a **dependency graph** of all derived metrics (which inputs/derived-values feed which). Use this to (a) drive the "explain this number" hint system in section 5, and (b) auto-generate the Mermaid dependency diagram in section 6.

## 3. Screens / IT information architecture

A left sidebar navigates between "sheets" (mirroring the original workbook, 1:1):

1. **Control Panel** (Master Inputs) — every input grouped into collapsible blocks A–L, with inline validation, reset-to-default, and the Scenario dropdown pinned at the top. Search/filter box to jump to any input by name.
2. **User Metrics** — MAU→DAU→PCU→RPS funnel, rendered as a big animated funnel chart plus the calc table.
3. **Frontend & CDN**
4. **API Gateway & Edge** (sizing, rate-limit tiers, auth, circuit breakers, WebSocket/SSE sizing)
5. **Load Balancer**
6. **Backend Services** — sortable/filterable React Table of all microservices (instances, cores, RAM, RPS capacity, headroom), with a red/green headroom badge
7. **Network Latency** — hop-by-hop latency waterfall (Recharts) + P50/P95/P99/SLA-pass-fail
8. **Kafka Design** — brokers/partitions/topics table + the throughput-vs-partitions sensitivity chart
9. **Database Design** — QPS cascade, IOPS, connections, storage, replica sizing
10. **Cache (Redis)** — memory sizing breakdown, ops/sec, cluster config
11. **DLQ & Error Handling** — retry-tier timeline, DLQ schema viewer, reprocess-throughput calculator
12. **Traffic Spikes & DDoS** — scenario comparison table (Normal/Flash/BF/CM/DDoS side by side), autoscale math, load-shedding priority ladder
13. **Observability** — metrics/logs/traces volume, SLO table
14. **Cloud Provider Mapping** — AWS/GCP/Azure/VPS equivalence table (filterable/searchable)
15. **Cloud Infra Picker** — instance-type cheat sheet with live $/hr × count × hours math
16. **Cost Estimator** — full cost table + Recharts pie breakdown + cost-per-1000-DAU metric, with a scenario comparison toggle (see this cost at Normal vs Black Friday side by side)
17. **Final Summary Cheat-Sheet** — one dense, print-friendly dashboard pulling the ~30 headline numbers from every sheet, plus the memorized "whiteboard script" paragraph, auto-filled with live numbers via template string interpolation
18. **Interview Practice** — the 10 scenario Q&A cards (expected answer, red flags, bonus points), each with a "reveal answer" interaction, and a **mock-interview timer mode** (60-minute countdown, jumps you through sheets 2→17 with per-sheet time budgets shown as a progress bar)
19. **Architecture Diagram** (Mermaid) — see section 6
20. **Whiteboard Canvas** (React Flow) — see section 6

## 4. Data model — Master Inputs (seed these exact defaults)

```
BLOCK A - USER METRICS
  MAU=10000000, DAU_PCT=20, PEAK_CONCURRENT_PCT=20, ACTIONS_PER_SESSION=30,
  PEAK_DURATION_SEC=3600, SAFETY_BUFFER=2

BLOCK B - TRAFFIC SHAPE
  READ_WRITE_SPLIT_READ_PCT=80, CACHE_HIT_PCT=95, QUERIES_PER_API_CALL=3,
  AVG_RESPONSE_SIZE_KB=50, AVG_REQUEST_SIZE_KB=2

BLOCK C - KAFKA
  AVG_MSG_SIZE_KB=1, REPLICATION_FACTOR=3, PRODUCER_PER_PARTITION_MBPS=10,
  CONSUMER_PER_PARTITION_MBPS=5, BROKER_CAPACITY_MBPS=500, MIN_BROKERS_HA=3,
  BROKER_MULTIPLE=6, TOPIC_RETENTION_DAYS=7

BLOCK D - DATABASE
  DB_ROW_SIZE_KB=2, DB_HOT_RETENTION_DAYS=30, DB_CONN_MULTIPLIER=2,
  DB_CONN_OVERHEAD=1, DB_READ_REPLICA_QPS=5000, DB_SSD_IOPS_PER_GB=50,
  DB_IOPS_PER_QUERY=1.2

BLOCK E - CACHE
  SESSION_SIZE_KB=1.5, CATALOG_SKUS=500000, CATALOG_ENTRY_KB=3,
  HOT_SKU_COUNT=100000, HOT_SKU_ENTRY_KB=1, CACHE_OVERHEAD_FACTOR=1.3,
  REDIS_SHARDS=3, REDIS_HEADROOM=1.5, REDIS_OPS_PER_NODE=100000

BLOCK F - APP SERVERS
  Cores_Per_App_Instance=4, RAM_Per_App_Instance_GB=8, Order_Svc_Instances=6,
  Payment_Svc_Instances=4, Inventory_Svc_Instances=4, Notification_Svc_Instances=3,
  Search_Svc_Instances=3, Gateway_Instances=3, RPS_Per_App_Instance=2000

BLOCK G - API GATEWAY
  Gateway_RPS_Capacity=3000, Gateway_CPU_Util_Target=60, Gateway_Overhead_ms=3,
  SSL_Handshake_ms=5, SSL_Rate_Pct=10, WAF_Rules=20, Rate_Limit_Anonymous_RPM=10,
  Rate_Limit_User_RPM=100, Rate_Limit_Premium_RPM=500

BLOCK H - NETWORK/LATENCY
  DNS_Lookup_ms=5, CDN_Edge_ms=10, CDN_Origin_Miss_ms=30, LB_Forward_ms=2,
  Service_Process_ms=20, DB_Query_ms=5, Redis_Query_ms=1, SLA_P95_ms=200

BLOCK I - DLQ/RETRY
  Max_Retries=3, Retry_Backoff_Base_sec=5, Retry_Backoff_Multiplier=2,
  DLQ_Retention_Days=30, Reprocess_Batch_Size=1000, Reprocess_Interval_min=15

BLOCK J - SPIKE/DDOS
  Spike_Multiplier=1 (scenario-driven), DDoS_Peak_RPS=1000000,
  Auto_Scale_Trigger_CPU=70, Auto_Scale_Cooldown_sec=60, Load_Shed_Threshold_Pct=90

BLOCK K - OBSERVABILITY
  Metrics_Retention_Days=15, Log_Retention_Days=30, Trace_Sample_Rate_Pct=1,
  Log_Size_Per_Request_KB=2

BLOCK L - COST (AWS us-east-1, on-demand, USD)
  Cost_Broker_hr=0.384, Cost_App_hr=0.17, Cost_DB_hr=0.504, Cost_Redis_hr=0.226,
  Cost_Gateway_hr=0.17, Cost_NLB_hr=0.0225, Cost_Hours_Month=730,
  Cost_Egress_Per_GB=0.09, Cost_S3_Per_TB=23, Cost_CDN_Per_GB=0.085

SCENARIO TABLE (overrides DAU_PCT, PEAK_CONCURRENT_PCT, Spike_Multiplier)
  Normal:        20, 20, 1
  Flash Sale:    30, 30, 5
  Black Friday:  50, 50, 10
  Cyber Monday:  60, 60, 15
  DDoS:          20, 100, 100
```

Implement every formula chain exactly as in the workbook (ask me for the full formula list per sheet if you need it — I have a companion "Derivation Card" with the 25 core formulas in calculation order; treat that as ground truth). Key chain to get right first: `DAU → PCU → Raw_RPS → Peak_RPS` (the anchor), then everything else fans out from `Peak_RPS`.

## 5. "Show me how this was calculated" hint system (critical feature)

Every single derived number on every screen must be **hoverable/clickable** to reveal:
- The human-readable formula (e.g. `Peak API RPS = Raw_RPS × Safety_Buffer`)
- The live substituted values (e.g. `3,333 × 2 = 6,667`)
- A one-line "why this matters" explanation (pull from the same `humanExplanation` field used to generate the interview talk tracks)
- A "trace dependencies" action that highlights (in the sidebar nav and, where applicable, in the architecture diagram) every upstream input that feeds this number

Implement this as a reusable `<Metric>` component: `<Metric name="Peak_RPS" />` renders the value plus a small (i) icon; clicking opens a popover/drawer with the above. This one component should be reused for literally every number in the app — do not duplicate this logic.

## 6. Diagrams

### 6a. Mermaid architecture diagram (read-only, auto-generated)
On the "Architecture Diagram" screen, render a live Mermaid flowchart of the full request path (Client → DNS → CDN → LB → Gateway → Services → Kafka/DB/Cache → DLQ) with **edge labels showing live computed values** (e.g. the Gateway→Service edge label shows the current `Peak_RPS` and `Gateway_Latency_ms`). Regenerate the Mermaid definition string reactively from the store so the diagram updates when scenario/inputs change. Also provide a sequence diagram variant for a single checkout request, and a state diagram for the DLQ retry-tier flow (event → retry.5s → retry.30s → retry.5m → DLQ). Style Mermaid with a theme that matches the app's dark mode.

### 6b. React Flow drag-and-drop whiteboard (editable, for practicing from scratch)
A separate "Whiteboard Canvas" screen using React Flow:
- A component palette (sidebar) with draggable node types: Client, DNS, CDN, WAF, Load Balancer (L4/L7), API Gateway, each microservice, Kafka, Postgres (primary/replica), Redis, DLQ, Observability stack, Cloud icons
- Drag nodes onto the canvas, connect them with labeled/directional edges (sync/async, protocol, latency annotation editable inline)
- A properties panel per node/edge to type in your own notes during a mock interview
- Save/load the canvas as JSON to `localStorage` (and an export/import JSON button) so I can build my own "whiteboard attempt" from a blank canvas and compare it against the auto-generated Mermaid reference diagram side-by-side (split-screen toggle)
- A "grade my diagram" checklist sidebar (static checklist, e.g. "Did you include a cache?", "Did you show async Kafka writes?", "Did you isolate payment?") I can tick off manually

## 7. Comparison tables (React Table everywhere)

- **Scenario comparison table**: rows = every headline metric (Peak RPS, gateway pods, brokers, DB QPS, monthly cost, etc.), columns = Normal / Flash Sale / Black Friday / Cyber Monday / DDoS, computed by running the derivation engine once per scenario without mutating the active UI state. Sortable, with delta/% badges vs. Normal.
- **Cloud provider mapping table**: filterable by component name, AWS/GCP/Azure/VPS side by side.
- **Instance picker table**: sortable by $/hr, vCPU, RAM; a "total monthly if used" computed column driven by the count from Backend Services.
- **Backend services table**: sortable, with conditional row highlighting when headroom < 50%.

## 8. Nice-to-haves (implement if time allows, in this order)

1. Export the Final Summary Cheat-Sheet screen to a print-friendly PDF (`window.print()` + print CSS is fine)
2. A 60-minute mock-interview timer mode that walks sheets 2→17 with a per-sheet time budget and a running "talk track" teleprompter panel
3. Command-palette (Cmd+K) to jump to any input or sheet
4. Shareable state via a compressed URL query param (so I can send myself a specific scenario link)
5. Unit tests (Vitest) on the derivation engine covering at least the 25 core formulas, using the default inputs as fixtures with known expected outputs (I can supply exact expected values from my Excel model on request)

## 9. Deliverables

- Full Next.js project structure, ready to `npm install && npm run dev`
- `derivations.ts` fully implemented and unit-tested for the core chain (User Metrics → Gateway → Kafka → DB → Cost) before moving on to polish
- README explaining the architecture, how to add a new metric (single source of truth pattern), and how to deploy to Vercel

Build incrementally: (1) store + derivation engine + Control Panel + User Metrics screen working end-to-end first, verify the numbers match Peak_RPS ≈ 6,667 at defaults, (2) then Backend/Kafka/DB/Cache/Cost screens, (3) then the hint system, (4) then Mermaid + React Flow, (5) then polish/nice-to-haves. Show me the plan before writing code.
