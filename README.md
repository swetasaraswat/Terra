# Terra
An AI-powered sustainability assistant that helps individuals track, understand, and actively reduce their daily carbon footprint through personalized insights and actionable, real-world habits.
Terra — Campus Sustainability, Made Measurable
Terra turns raw campus sustainability readings (waste, energy, water) into statistically-verified, accreditation-ready ESG intelligence — built as a prototype for the 1M1B × Microsoft Green Skills & Applied AI Internship.
Live demo: add your deployed link here (e.g. Vercel/Netlify/GitHub Pages)
Demo video: add your recording link here
The Problem
Campuses collect sustainability data — but nobody can trust it, act on it, or prove it.
Waste, energy and water readings live in registers, spreadsheets and WhatsApp groups
A leaking pipe or meter fault looks identical to normal noise until someone reads every row by eye
NAAC Criterion 7 requires ongoing environmental audit evidence that most colleges can't produce on demand
The Solution
Terra is configured once — campus profile, active modules, and zones — and from that point on, every logged reading is automatically checked against a live statistical baseline, flagged if abnormal, and rolled up into a dashboard, alert queue, ESG scorecard, and printable report.
Features
Module
What it does
Dashboard
KPIs, weekly trend vs. threshold, top waste source at a glance
Log Entry
Submit a reading, get an instant anomaly check against the live baseline
Alerts
IQR-flagged entries with an SLA clock and a response log
ESG Metrics
Six auto-computed Environmental / Social / Governance indicators
Raw Data
Every logged entry, filterable by module, zone, and flag status
Report
Auto-written executive summary, findings, and next steps — one click to print
How Anomaly Detection Works
Terra flags readings using the interquartile range (IQR) method, computed independently per module (waste, energy, water don't share one blended threshold):
Code
This means the same raw number can be flagged in one zone and pass normally in another — the threshold adapts to that module's own historical spread, not a fixed number.
Onboarding Flow
Campus Setup — name, city, campus type, student strength
Choose Modules — activate only what you track (waste, energy, water, transport, green space, carbon)
Define Zones — hostel, canteen, academic block, and any custom zones
Tech Stack
HTML / CSS / vanilla JavaScript — no build step, no backend, deploys instantly
Chart.js for live trend and distribution charts
Client-side IQR anomaly engine
Getting Started
Terra runs entirely in the browser — no install required.
Bash
To deploy: drag the folder into Vercel or Netlify, or enable GitHub Pages on this repo (Settings → Pages → deploy from main).
Project Structure
Code
Roadmap
Pilot (Months 1–2): one zone at VCTM Aligarh, validate alert accuracy
Expansion (Months 3–5): remaining zones and modules, facility admin onboarding
Full-scale (Months 6–12): persistent backend + auth, IoT meter integration, mobile log entry, WhatsApp/email alerts
Why It Matters
Every reading logged in Terra produces evidence mapped to NAAC Criterion 7 — Institutional Values & Best Practices, which most colleges currently assemble by hand once a year. Terra generates it continuously, as a byproduct of normal operation.
Author
Sweta Saraswat
B.Tech CSE · Vivekananda College of Technology & Management, Aligarh
Built for the AICTE 1M1B Green Skills & Applied AI Internship 2026, in partnership with Microsoft
GitHub: github.com/swetasaraswat
LinkedIn: linkedin.com/in/sweta-saraswat-879995367
Medium: medium.com/@swetasaraswat2
License
MIT — see LICENSE for details.
