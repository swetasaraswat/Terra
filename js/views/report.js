// ══════════════════════════════════════════════════════════
// REPORT VIEW
// ══════════════════════════════════════════════════════════
function reportHTML() {
  const d = flagData();
  const waste = d.filter(x => x.module === 'waste');
  const total = waste.reduce((s, x) => s + x.value, 0);
  const flags = d.filter(x => x.flagged);
  const locMap = {};
  waste.forEach(x => { locMap[x.location] = (locMap[x.location] || 0) + x.value; });
  const topLoc = Object.entries(locMap).sort((a, b) => b[1] - a[1])[0];
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
  <div class="page-header">
    <div class="page-title">Sustainability Report</div>
    <div class="page-sub">Auto-generated · ${today} · ${CONFIG.name}, ${CONFIG.city}</div>
  </div>
  <div class="report-block">
    <div class="rb-head"><div class="rb-title">Executive Summary</div><button class="print-btn" onclick="window.print()">⬇ Export / Print</button></div>
    <div class="rb-sub">This report covers sustainability data collected by <strong>${CONFIG.name}</strong> (${CONFIG.city}) across ${CONFIG.modules.length} active module(s): <strong>${CONFIG.modules.join(', ')}</strong>. Data spans ${CONFIG.locations.length} campus zone(s). The Terra IQR anomaly detection system flagged <strong>${flags.length} reading(s)</strong> for investigation.</div>
    <div class="rb-stat-row">
      <div class="rb-stat"><div class="v" style="color:var(--green)">${total.toFixed(0)} kg</div><div class="l">Total waste</div></div>
      <div class="rb-stat"><div class="v" style="color:${flags.length ? 'var(--red)' : 'var(--green)'}">${flags.length}</div><div class="l">Anomalies</div></div>
      <div class="rb-stat"><div class="v">${topLoc ? topLoc[0] : '—'}</div><div class="l">Top source</div></div>
      <div class="rb-stat"><div class="v" style="color:var(--amber)">${respondedAlerts.size}</div><div class="l">Alerts responded</div></div>
    </div>
  </div>
  <div class="report-block">
    <div class="rb-title">Key Findings</div>
    <div style="margin-top:.6rem;font-size:.82rem;line-height:2;color:var(--muted)">
      ${topLoc ? `• <strong style="color:var(--text)">${topLoc[0]}</strong> is the highest waste-generating zone at <strong style="color:var(--text)">${topLoc[1].toFixed(0)} kg</strong> (${(topLoc[1] / total * 100).toFixed(0)}% of total). It should be the first target for any waste reduction or segregation intervention.<br>` : ''}
      ${flags.length ? `• <strong style="color:var(--text)">${flags.length} anomalous reading(s)</strong> were detected by the IQR algorithm — exceeding Q3 + 1.5×IQR threshold. These warrant investigation to determine if they are data entry errors, one-off events, or signs of a systemic problem.<br>` : '• No anomalous readings detected in the current dataset. All readings within normal IQR range.<br>'}
      • ${CONFIG.modules.length} module(s) active. ${6 - CONFIG.modules.length > 0 ? `${6 - CONFIG.modules.length} module(s) not yet enabled — consider activating ${['energy', 'water', 'transport', 'carbon', 'green'].filter(m => !CONFIG.modules.includes(m)).slice(0, 2).join(' and ')} for a fuller sustainability picture.` : 'All modules active — full ESG coverage achieved.'}
    </div>
  </div>
  <div class="report-block">
    <div class="rb-title">Recommended Next Steps</div>
    <div style="margin-top:.6rem;font-size:.82rem;line-height:2;color:var(--muted)">
      ${flags.length > respondedAlerts.size ? `• <strong style="color:var(--red)">${flags.length - respondedAlerts.size} alert(s) still open</strong> — log a response via the Alerts tab to meet your ${CONFIG.sla}-day SLA.<br>` : ''}
      • Run a student survey on ${topLoc ? topLoc[0] : 'the top waste-generating zone'} to establish the Social ESG baseline (target: 60%+ satisfaction after one semester).<br>
      • Expand monitoring to ${CONFIG.locations.length < 6 ? 'additional campus zones' : 'maintain all current zones'} and aim for weekly data entry across all active modules.<br>
      • Share this report with ${CONFIG.role === 'Student (Research / Project)' ? 'your faculty supervisor and the campus facility manager' : "the principal's office and sustainability committee"} as part of the ${CONFIG.modules.includes('waste') ? 'waste management' : 'sustainability'} pilot documentation.
    </div>
  </div>`;
}
