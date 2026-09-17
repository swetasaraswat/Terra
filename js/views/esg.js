// ══════════════════════════════════════════════════════════
// ESG METRICS VIEW
// ══════════════════════════════════════════════════════════
function esgHTML() {
  const d = flagData();
  const flags = d.filter(x => x.flagged).length;
  const total = d.filter(x => x.module === 'waste').reduce((s, x) => s + x.value, 0);
  const responded = respondedAlerts.size;
  const totalFlags = d.filter(x => x.flagged && x.module === 'waste').length;
  const respPct = totalFlags ? Math.round(responded / totalFlags * 100) : 0;

  const metrics = [
    { pillar: 'ENV', pillarColor: 'var(--green)', name: 'Total waste logged (kg)', val: `${total.toFixed(0)} kg`, target: 'Track weekly · baseline for reduction', pct: Math.min(100, total / 10), badge: 'Tracking Live', badgeClass: 'badge-live' },
    { pillar: 'ENV', pillarColor: 'var(--green)', name: 'Anomalies detected & flagged', val: `${flags} flagged`, target: '100% detection rate target', pct: flags > 0 ? 100 : 0, badge: flags > 0 ? 'Flagged' : 'Clean', badgeClass: flags > 0 ? 'badge-base' : 'badge-live' },
    { pillar: 'SOC', pillarColor: 'var(--blue)', name: 'Campus zones under monitoring', val: `${CONFIG.locations.length} zones`, target: `Expand to all campus areas`, pct: Math.min(100, CONFIG.locations.length / 9 * 100), badge: 'Active', badgeClass: 'badge-live' },
    { pillar: 'SOC', pillarColor: 'var(--blue)', name: 'Active sustainability modules', val: `${CONFIG.modules.length} of 6`, target: 'All 6 modules target', pct: CONFIG.modules.length / 6 * 100, badge: 'Configured', badgeClass: 'badge-live' },
    { pillar: 'GOV', pillarColor: 'var(--amber)', name: `Alerts responded to (SLA: ${CONFIG.sla}d)`, val: `${responded} / ${totalFlags}`, target: `100% response rate · ${CONFIG.sla}-day SLA`, pct: respPct, badge: respPct === 100 ? 'SLA Met' : 'Pending', badgeClass: respPct === 100 ? 'badge-live' : 'badge-base' },
    { pillar: 'GOV', pillarColor: 'var(--amber)', name: 'Alert delivery configured', val: CONFIG.alertDel, target: 'Automated delivery active', pct: 100, badge: 'Configured', badgeClass: 'badge-live' },
  ];

  return `
  <div class="page-header">
    <div class="page-title">ESG Impact Metrics</div>
    <div class="page-sub">Live outcomes across Environmental, Social & Governance pillars · Updates as you log data and respond to alerts</div>
  </div>
  <div class="esg-grid">${metrics.map(m => `
    <div class="esg-card">
      <div class="esg-pillar" style="color:${m.pillarColor}">${m.pillar}</div>
      <div class="esg-name">${m.name}</div>
      <div class="esg-val" style="color:${m.pillarColor}">${m.val}</div>
      <div class="esg-target">${m.target}</div>
      <div class="esg-track"><div class="esg-fill" style="width:${m.pct}%;background:${m.pillarColor}"></div></div>
      <span class="esg-badge ${m.badgeClass}">${m.badge}</span>
    </div>`).join('')}
  </div>
  <div class="card">
    <div class="card-label">Implementation Phase</div>
    <div style="display:flex;gap:.6rem;align-items:stretch;flex-wrap:wrap">
      ${[['PILOT', 'var(--green)', 'Months 1–2', '1 zone, validate alerts & response loop'],
        ['EXPANSION', 'var(--blue)', 'Months 3–5', 'Add more zones, loop in admin'],
        ['FULL-SCALE', 'var(--amber)', 'Months 6–12', 'All zones, dashboard replaces email, handoff to staff']].map(([tag, c, dur, desc]) => `
      <div style="flex:1;min-width:180px;background:var(--surface2);border-radius:8px;padding:.8rem">
        <div style="font-size:.68rem;font-weight:700;color:${c};letter-spacing:.08em;margin-bottom:.3rem">${tag}</div>
        <div style="font-size:.72rem;color:var(--muted);margin-bottom:.3rem">${dur}</div>
        <div style="font-size:.78rem;color:var(--text)">${desc}</div>
      </div>`).join('')}
    </div>
  </div>`;
}
