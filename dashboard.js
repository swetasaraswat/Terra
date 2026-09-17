// ══════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════════════════
function dashboardHTML() {
  const d = flagData();
  const wasteData = d.filter(x => x.module === 'waste');
  const total = wasteData.reduce((s, x) => s + x.value, 0);
  const flags = d.filter(x => x.flagged);
  const locMap = {};
  wasteData.forEach(x => { locMap[x.location] = (locMap[x.location] || 0) + x.value; });
  const topLoc = Object.entries(locMap).sort((a, b) => b[1] - a[1])[0];
  const score = Math.max(0, 100 - flags.length * 15 - (total > 500 ? 10 : 0)).toFixed(0);

  return `
  <div class="page-header">
    <div class="page-title">${CONFIG.name} — Sustainability Dashboard</div>
    <div class="page-sub">${CONFIG.city} · ${CONFIG.type} · ${CONFIG.modules.join(', ')} modules active</div>
  </div>
  <div class="kpi-row">
    <div class="kpi"><div class="kpi-accent" style="background:#6FCF97"></div>
      <div class="kpi-label">Total Waste Logged</div>
      <div class="kpi-val">${total.toFixed(0)}<span style="font-size:1rem;font-weight:400;color:var(--muted)"> kg</span></div>
      <div class="kpi-sub">Across all logged entries</div></div>
    <div class="kpi"><div class="kpi-accent" style="background:${flags.length ? '#EB5757' : '#6FCF97'}"></div>
      <div class="kpi-label">Anomalies Detected</div>
      <div class="kpi-val" style="color:${flags.length ? 'var(--red)' : 'var(--green)'}">${flags.length}</div>
      <div class="kpi-sub">${flags.length ? 'Requires investigation' : 'All readings normal'}</div></div>
    <div class="kpi"><div class="kpi-accent" style="background:#F2C94C"></div>
      <div class="kpi-label">Top Waste Source</div>
      <div class="kpi-val" style="font-size:1.1rem;padding-top:.2rem">${topLoc ? topLoc[0] : '—'}</div>
      <div class="kpi-sub">${topLoc ? (topLoc[1] / total * 100).toFixed(0) + '% of total' : 'no data'}</div></div>
    <div class="kpi"><div class="kpi-accent" style="background:#56CCF2"></div>
      <div class="kpi-label">Sustainability Score</div>
      <div class="kpi-val" style="color:${score > 70 ? 'var(--green)' : score > 40 ? 'var(--amber)' : 'var(--red)'}">${score}</div>
      <div class="kpi-sub">Out of 100 · IQR-based</div></div>
  </div>
  <div class="two-col">
    <div class="card"><div class="card-label">Weekly Waste Trend — with Anomaly Threshold</div><canvas id="ch-trend"></canvas></div>
    <div class="card"><div class="card-label">Waste by Location (kg)</div><canvas id="ch-loc"></canvas></div>
  </div>
  <div class="three-col">
    <div class="card"><div class="card-label">Active Modules</div>
      ${CONFIG.modules.map(m => `<div style="display:flex;align-items:center;gap:.5rem;padding:.3rem 0;font-size:.8rem;border-bottom:1px solid var(--border)"><div style="width:7px;height:7px;border-radius:50%;background:var(--green)"></div>${m}</div>`).join('')}
    </div>
    <div class="card"><div class="card-label">Campus Zones Tracked</div>
      ${CONFIG.locations.map(l => `<div style="font-size:.78rem;padding:.3rem 0;border-bottom:1px solid var(--border);color:var(--muted)">${l}</div>`).join('')}
    </div>
    <div class="card"><div class="card-label">IQR Anomaly Formula</div>
      <div style="background:var(--surface2);border-radius:8px;padding:.7rem;font-size:.72rem;line-height:2;font-variant-numeric:tabular-nums;color:var(--muted)">
        Q1 = 25th percentile<br>Q3 = 75th percentile<br>IQR = Q3 − Q1<br>
        <span style="color:var(--red)">flag if value > Q3 + 1.5×IQR</span>
      </div>
      <div style="margin-top:.6rem;font-size:.72rem;color:var(--muted)">Current threshold: <strong style="color:var(--text)">${wasteData[0] ? wasteData[0].threshold.toFixed(1) : 0} kg</strong></div>
    </div>
  </div>`;
}

function initDashboard() {
  const d = flagData();
  const waste = d.filter(x => x.module === 'waste');

  // Weekly aggregation
  const wkMap = {};
  waste.forEach(x => {
    const dt = new Date(x.date), day = dt.getDay();
    const mon = new Date(dt);
    mon.setDate(dt.getDate() - day + (day === 0 ? -6 : 1));
    const k = mon.toISOString().slice(0, 10);
    wkMap[k] = (wkMap[k] || 0) + x.value;
  });
  const wks = Object.keys(wkMap).sort();
  const wkVals = wks.map(w => +wkMap[w].toFixed(1));
  const wiqr = iqrThreshold(wkVals);
  const wkLabels = wks.map(w => {
    const dt = new Date(w);
    return `${dt.getDate()} ${dt.toLocaleString('en', { month: 'short' })}`;
  });

  charts.trend = new Chart(document.getElementById('ch-trend'), {
    type: 'line',
    data: {
      labels: wkLabels,
      datasets: [
        {
          label: 'Weekly total', data: wkVals, borderColor: '#6FCF97', backgroundColor: '#6FCF9715',
          borderWidth: 2, pointRadius: 5,
          pointBackgroundColor: wkVals.map(v => v > wiqr.threshold ? '#EB5757' : '#6FCF97'),
          fill: true, tension: 0,
        },
        {
          label: 'Threshold', data: wks.map(() => wiqr.threshold), borderColor: '#EB5757',
          borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#7A8FA0', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#7A8FA0' }, grid: { color: '#2A304522' } },
        y: { ticks: { color: '#7A8FA0' }, grid: { color: '#2A304522' } },
      },
    },
  });

  const locMap = {};
  waste.forEach(x => { locMap[x.location] = (locMap[x.location] || 0) + x.value; });
  const locs = Object.entries(locMap).sort((a, b) => b[1] - a[1]);
  const colors = ['#6FCF97', '#56CCF2', '#BB6BD9', '#F2C94C', '#EB5757', '#6FCF97aa', '#56CCF2aa'];

  charts.loc = new Chart(document.getElementById('ch-loc'), {
    type: 'bar',
    data: {
      labels: locs.map(l => l[0]),
      datasets: [{
        label: 'kg', data: locs.map(l => +l[1].toFixed(1)),
        backgroundColor: locs.map((_, i) => colors[i % colors.length]),
        borderRadius: 6, borderWidth: 0,
      }],
    },
    options: {
      responsive: true, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#7A8FA0' }, grid: { color: '#2A304522' } },
        y: { ticks: { color: '#ccc' }, grid: { color: '#2A304522' } },
      },
    },
  });
}
