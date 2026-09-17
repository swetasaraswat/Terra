# Terra — Campus Sustainability, Made Measurable

**Live demo:** [terra1ai.netlify.app](https://terra1ai.netlify.app)
**Demo video:** [add link]
**License:** MIT

Terra turns raw campus sustainability readings — waste, energy, water — into statistically verified, accreditation-ready ESG intelligence. Built as the capstone prototype for the AICTE 1M1B Green Skills & Applied AI Internship, in partnership with Microsoft.

## The Problem

Indian higher-education institutions are increasingly required to produce environmental audit evidence for accreditation (NAAC Criterion 7), but most campuses have no systematic way to do it:

- Waste, energy, and water readings live scattered across registers, spreadsheets, and WhatsApp groups
- A leaking pipe or a genuine spike looks identical to normal noise until someone manually reviews every entry
- Audit evidence gets assembled by hand, once a year, under deadline pressure

## The Solution

Terra is configured once — campus profile, active modules, and zones — and from that point on, every logged reading is automatically checked against a live statistical baseline, flagged if abnormal, and rolled into a dashboard, an alert queue, an ESG scorecard, and a printable report. What used to be an annual manual audit becomes a continuous byproduct of normal data entry.

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

Terra flags readings using the interquartile range (IQR) method, computed independently per module — waste (kg), energy (kWh), and water (L) don't share one blended threshold, since mixing units would make the statistics meaningless:

```js
function percentile(arr, p) {
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

A reading is flagged when it exceeds `Q3 + 1.5 × IQR` for its own module's historical distribution — the standard statistical definition of an outlier. This means the same raw number can be flagged in one zone and pass normally in another: the threshold adapts to that module's own spread rather than a fixed number picked by hand.

## Onboarding Flow

1. **Campus Setup** — name, city, campus type, student strength
2. **Choose Modules** — activate only what's tracked (waste, energy, water, transport, green space, carbon)
3. **Define Zones** — hostel, canteen, academic block, and any custom zones

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript — no framework, no build step, deploys instantly
- **Visualization:** Chart.js for live trend and distribution charts
- **Statistics:** a client-side IQR anomaly engine, computed per module
- **Hosting:** Netlify

## Project Structure

```
Terra/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── state.js              # app config and sample dataset
│   ├── anomalyDetection.js   # IQR engine
│   ├── onboarding.js
│   ├── navigation.js
│   └── views/
│       ├── dashboard.js
│       ├── alerts.js
│       ├── logEntry.js
│       ├── esg.js
│       ├── dataTable.js
│       └── report.js
├── LICENSE
└── README.md
```

## Getting Started

Terra runs entirely in the browser — no install, no backend.

```bash
git clone https://github.com/swetasaraswat/Terra.git
cd Terra
open index.html
```

To deploy: drag the folder into Netlify or Vercel, or enable GitHub Pages on this repo (Settings → Pages → deploy from `main`).

## Roadmap

- **Pilot (Months 1–2):** one zone at VCTM Aligarh, validate alert accuracy
- **Expansion (Months 3–5):** remaining zones and modules, facility admin onboarding
- **Full-scale (Months 6–12):** persistent backend + auth, IoT meter integration, mobile log entry, WhatsApp/email alerts

## Why It Matters

Every reading logged in Terra produces evidence mapped to NAAC Criterion 7 — Institutional Values & Best Practices — which most colleges currently assemble by hand once a year. Terra generates it continuously, as a byproduct of normal operation, turning a compliance burden into a standing dashboard.

## Author

**Sweta Saraswat**
B.Tech CSE · Vivekananda College of Technology & Management, Aligarh
Built for the AICTE 1M1B Green Skills & Applied AI Internship, in partnership with Microsoft

- GitHub: [github.com/swetasaraswat](https://github.com/swetasaraswat)
- LinkedIn: [linkedin.com/in/swetasaraswat](https://linkedin.com/in/swetasaraswat)
- Medium: [medium.com/@swetasaraswat2](https://medium.com/@swetasaraswat2)

## License

Released under the [MIT License](LICENSE).
