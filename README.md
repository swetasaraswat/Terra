# Terra — Campus Sustainability, Made Measurable

Terra turns raw campus sustainability readings (waste, energy, water) into statistically verified, accreditation-ready ESG intelligence built as a prototype for the 1M1B × Microsoft Green Skills & Applied AI Internship.

**Live demo:** [terra1ai.netlify.app](https://terra1ai.netlify.app)
**Demo video:** [add link]

## The Problem

Campuses collect sustainability data but nobody can trust it, act on it, or prove it.

 Waste, energy, and water readings live scattered across registers, spreadsheets, and WhatsApp groups
 A leaking pipe or meter fault looks identical to normal noise until someone reads every row by eye
 NAAC Criterion 7 requires ongoing environmental audit evidence that most colleges can't produce on demand

## The Solution

Terra is configured once, campus profile, active modules, and zones and from that point on, every logged reading is automatically checked against a live statistical baseline, flagged if abnormal, and rolled up into a dashboard, alert queue, ESG scorecard, and printable report.

## Features

| Module | What it does |
|---|---|
| Dashboard | KPIs, weekly trend vs. threshold, top waste source at a glance |
| Log Entry | Submit a reading, get an instant anomaly check against the live baseline |
| Alerts | IQR-flagged entries with an SLA clock and a response log |
| ESG Metrics | Six auto-computed Environmental / Social / Governance indicators |
| Raw Data | Every logged entry, filterable by module, zone, and flag status |
| Report | Auto-written executive summary, findings, and next steps — one click to print |

## How Anomaly Detection Works

Terra flags readings using the interquartile range (IQR) method, computed independently per module — waste, energy, and water don't share one blended threshold:

```js
// function percentile(arr, p) {
  const s = [...arr].sort((a, b) => a - b);
  const i = (p / 100) * (s.length - 1);
  const lo = Math.floor(i), hi = Math.ceil(i);
  return s[lo] + (s[hi] - s[lo]) * (i - lo);
}

function iqrThreshold(values) {
  const q1 = percentile(values, 25);
  const q3 = percentile(values, 75);
  const iqr = q3 - q1;
  return { q1, q3, iqr, threshold: q3 + 1.5 * iqr };
}
```

This means the same raw number can be flagged in one zone and pass normally in another — the threshold adapts to that module's own historical spread, not a fixed number.

## Onboarding Flow

1. **Campus Setup** — name, city, campus type, student strength
2. **Choose Modules** — activate only what you track (waste, energy, water, transport, green space, carbon)
3. **Define Zones** — hostel, canteen, academic block, and any custom zones

## Tech Stack

- HTML / CSS / vanilla JavaScript — no build step, no backend, deploys instantly
- Chart.js for live trend and distribution charts
- Client-side IQR anomaly engine

## Getting Started

Terra runs entirely in the browser — no install required.

```bash
# clone and open
git clone https://github.com/swetasaraswat/Terra.git
cd Terra
open index.html
```

## Project Structure

```
Terra/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── anomalyDetection.js
└── README.md
```

## Roadmap

- **Pilot (Months 1–2):** one zone at VCTM Aligarh, validate alert accuracy
- **Expansion (Months 3–5):** remaining zones and modules, facility admin onboarding
- **Full-scale (Months 6–12):** persistent backend + auth, IoT meter integration, mobile log entry, WhatsApp/email alerts

## Why It Matters

Every reading logged in Terra produces evidence mapped to NAAC Criterion 7 — Institutional Values & Best Practices, which most colleges currently assemble by hand once a year. Terra generates it continuously, as a byproduct of normal operation.

## Author

**Sweta Saraswat**
B.Tech CSE · Vivekananda College of Technology & Management, Aligarh
Built for the AICTE 1M1B Green Skills & Applied AI Internship 2026, in partnership with Microsoft

- GitHub: [github.com/swetasaraswat](https://github.com/swetasaraswat)
- LinkedIn: [linkedin.com/in/sweta-saraswat-879995367](https://linkedin.com/in/sweta-saraswat-879995367)
- Medium: [medium.com/@swetasaraswat2](https://medium.com/@swetasaraswat2)
rtfolio pr
