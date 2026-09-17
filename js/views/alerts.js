// ══════════════════════════════════════════════════════════
// ALERTS VIEW
// ══════════════════════════════════════════════════════════
function alertsHTML() {
  const d = flagData();
  const waste = d.filter(x => x.module === 'waste');
  const wkMap = {};
  waste.forEach(x => {
    const dt = new Date(x.date), day = dt.getDay();
    const mon = new Date(dt);
    mon.setDate(dt.getDate() - day + (day === 0 ? -6 : 1));
    const k = mon.toISOString().slice(0, 10);
    if (!wkMap[k]) wkMap[k] = { total: 0, entries: [], flagged: false };
    wkMap[k].total += x.value;
    wkMap[k].entries.push(x);
  });
  const iq = iqrThreshold(Object.values(wkMap).map(w => w.total));
  Object.values(wkMap).forEach(w => { w.flagged = w.total > iq.threshold; });

  const flagCount = Object.values(wkMap).filter(w => w.flagged).length;
  document.getElementById('alert-badge').textContent = Math.max(0, flagCount - respondedAlerts.size);

  let html = `
  <div class="page-header">
    <div class="page-title">Anomaly Alerts</div>
    <div class="page-sub">IQR-based spike detection · SLA: respond within ${CONFIG.sla} day(s) · Delivery: ${CONFIG.alertDel}</div>
  </div>`;

  const sortedWks = Object.keys(wkMap).sort().reverse();
  sortedWks.forEach((wk, i) => {
    const w = wkMap[wk];
    const pct = ((w.total - iq.threshold) / iq.threshold * 100).toFixed(0);
    const top = [...w.entries].sort((a, b) => b.value - a.value)[0];
    const dt = new Date(wk);
    const wLabel = `${dt.getDate()} ${dt.toLocaleString('en', { month: 'short', year: 'numeric' })}`;
    const isResponded = respondedAlerts.has(wk);

    if (w.flagged) {
      html += `<div class="alert-item ${isResponded ? 'responded' : 'flagged'}" id="ai-${i}">
        <div class="ai">
          <div class="ai-top">
            <span class="atag ${isResponded ? 'atag-grn' : 'atag-red'}">${isResponded ? '✓ RESPONDED' : '⚠ ANOMALY'}</span>
            <span style="font-size:.72rem;color:var(--muted)">Week of ${wLabel} · ${top?.location || 'Campus'}</span>
          </div>
          <div class="ai-title">${w.total.toFixed(1)} kg collected — ${pct}% above threshold</div>
          <div class="ai-sub">Highest single entry: <strong>${top?.value} ${top?.unit}</strong> at <strong>${top?.location}</strong> on ${top?.date}</div>
          <div class="ai-nums">
            <div class="ai-num"><div class="v" style="color:${isResponded ? 'var(--green)' : 'var(--red)'}">${w.total.toFixed(1)} kg</div><div class="l">Week total</div></div>
            <div class="ai-num"><div class="v">${iq.threshold.toFixed(1)} kg</div><div class="l">Threshold</div></div>
            <div class="ai-num"><div class="v" style="color:var(--amber)">+${pct}%</div><div class="l">Deviation</div></div>
            <div class="ai-num"><div class="v">${w.entries.length}</div><div class="l">Entries</div></div>
          </div>
          <div class="resp-form">
            <textarea id="rtxt-${i}" placeholder="What did you find? What action was taken? (e.g. 'Bulk construction waste from hostel renovation. Arranged one-off pickup. Not recurring.')"></textarea>
            <div><button class="resp-submit" onclick="submitResp('${wk}',${i})">✓ Mark Responded</button></div>
          </div>
          ${isResponded ? '<div style="font-size:.72rem;color:var(--green);font-weight:600;margin-top:.4rem">✓ Logged within SLA — ESG governance metric updated</div>' : ''}
        </div>
        <div class="resp-col">
          ${!isResponded ? `<button class="btn-small btn-primary" onclick="toggleRespForm(${i})">Log Response</button>` : `<span class="btn-small btn-done">✓ Done</span>`}
        </div>
      </div>`;
    } else {
      html += `<div class="alert-item">
        <div class="ai">
          <div class="ai-top"><span class="atag atag-grn">✓ NORMAL</span><span style="font-size:.72rem;color:var(--muted)">Week of ${wLabel}</span></div>
          <div class="ai-title">${w.total.toFixed(1)} kg — within expected range</div>
          <div class="ai-sub">${w.entries.length} entries across ${[...new Set(w.entries.map(e => e.location))].join(', ')}</div>
        </div>
      </div>`;
    }
  });

  if (!sortedWks.length) {
    html += `<div class="empty">No entries logged yet — add one from the Log Entry tab to see it checked here.</div>`;
  }

  return html;
}

function toggleRespForm(i) {
  document.getElementById('rtxt-' + i)?.closest('.resp-form')?.classList.toggle('open');
}

function submitResp(wk, i) {
  respondedAlerts.add(wk);
  showView('alerts', document.querySelectorAll('.nav-item')[1]);
}
