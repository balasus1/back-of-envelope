# System Design — Back-of-the-Envelope Calculator & Architecture Rubric

[![Live Web App](https://img.shields.io/badge/Live%20App-systemdesign.balashan.dev-indigo?style=for-the-badge&logo=vercel)](https://systemdesign.balashan.dev)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg?style=for-the-badge)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **100% Free & Open-Source System Design Capacity Sizing Engine & 16-Layer Interview Rubric.**  
> Master back-of-the-envelope calculations for FAANG/tier-1 software engineering interviews with zero guesswork.

🌐 **Live Production App:** [https://systemdesign.balashan.dev](https://systemdesign.balashan.dev)  
👨‍💻 **Author & Portfolio:** [balashan.dev](https://portfolio.balashan.dev) • [@balashan0027](https://x.com/balashan0027) • [LinkedIn](https://linkedin.com/in/spike0027)

---

## 💡 Why This Project Exists

Having personally navigated tech industry layoffs and high-stakes technical interviews, I experienced firsthand how stressful, fragmented, and paywalled system design preparation often is. While LeetCode exists for algorithms, candidates frequently struggle with back-of-the-envelope capacity planning under pressure.

This project was built to level the playing field. It is **100% free and open-source for personal learning, interview practice, and community study**.

---

## 🎯 Overview

**System Design** replaces static cheat sheets with a live reactive mathematical calculation engine and grading rubric for distributed systems.

- ⚡ **Interactive Capacity Math**: Real-time reactive recalculation across 250+ distributed system metrics.
- 📐 **16 Architectural Sheets**: Client tier, Edge CDN, API Gateway, Microservices, Kafka Event Bus, Sharded DBs, Distributed Caches, DLQ/Reprocessing, Observability, and AWS Costing.
- 📋 **FAANG Interview Rubric**: 16-layer scoring matrix detailing what distinguishes an L4 vs. L5 vs. L6 architectural answer.
- 💡 **8 Core Probing Questions**: Structured framework to clarify functional & non-functional requirements in under 5 minutes.
- ⏱️ **60-Minute Mock Timer & Whiteboard Talk-Tracks**: Auto-generated 60-second talk-tracks ready for live interview whiteboard delivery.

---

## 🔍 Key Calculators & Features

| Architecture Domain | Derived Metrics & Equations |
| :--- | :--- |
| **Traffic & RPS** | Daily Active Users (DAU), Read/Write Ratios, Peak Traffic Multipliers (3x–5x), Ingress/Egress Bandwidth. |
| **API Gateway & CDN** | TLS termination overhead, Rate Limiting (Token Bucket), Connection Pooling, Cache Hit Ratios (CHR). |
| **Kafka Event Bus** | Topic Partitions ($P = \max(R_{rps}/R_p, W_{rps}/W_p)$), Broker Counts, Consumer Lag, Retention Storage. |
| **Database & Sharding** | IOPS, Primary/Replica sizing, Consistent Hashing virtual nodes, Connection saturation limits. |
| **Distributed Caches** | Redis/Memcached cluster memory sizing, 80/20 Pareto principle RAM, Eviction policies (LRU/LFU). |
| **Resilience & DLQ** | Exponential backoff jitter, Circuit Breaker trip thresholds, Dead Letter Queue buffer sizing. |
| **AWS Infrastructure Cost** | Compute (EC2/EKS), Managed DBs (RDS/Aurora), Kafka (MSK), Cache (ElastiCache), Network Egress cost. |

---

## 🚀 Quick Start (Local Development)

Clone the repository and run the development server locally:

```bash
# 1. Clone the repository
git clone https://github.com/balasus1/back-of-envelope.git
cd back-of-envelope/system-design-studio

# 2. Install dependencies
npm install

# 3. Start the Next.js local server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 🧪 Running Unit Tests & Build

```bash
# Run unit tests (vitest)
npm run test

# Run production build
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router, Static Generation)
- **UI & State**: React 19, TypeScript, Tailwind CSS v4, Zustand
- **Visualizations**: Lucide Icons, Recharts, Mermaid Diagrams
- **Analytics & Telemetry**: Vercel Analytics (`@vercel/analytics`)
- **SEO & Discoverability**: Dynamic XML Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), JSON-LD Schema.org Structured Data

---

## 🤝 Contributing & Community

We warmly welcome community contributions! You are encouraged to:
- Fork this repository
- Add new distributed system calculators or cloud cost profiles
- Improve mathematical models, formulas, and interview rubrics
- Submit improvements via Pull Requests (PRs)

---

## 📄 Open Source License & Terms of Use

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International Public License ([CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/))**.

### 🌟 Friendly Terms:
- **✅ Free For All Learners & Job Seekers**: You are completely free to fork, clone, study, use during mock interviews, and share this project with friends, peers, and candidates.
- **❌ Strictly Non-Commercial / No Paywalling**: This tool was built with empathy for engineers facing career transitions and layoffs. **You may NOT sell, commercialize, bundle into paid courses, or charge any job seeker or engineer for access to this tool, its derivatives, or its derived content.**

See the full [`LICENSE`](./LICENSE) file for details.

---

<p align="center">
  Copyright © 2026 <a href="https://portfolio.balashan.dev">Bala Shan</a>. Built with ❤️ for software engineers worldwide.
</p>
