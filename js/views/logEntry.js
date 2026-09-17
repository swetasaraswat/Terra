// ══════════════════════════════════════════════════════════
// LOG ENTRY VIEW
// ══════════════════════════════════════════════════════════
function logHTML() {
  const modOpts = CONFIG.modules.map(m => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('');
  const locOpts = CONFIG.locations.map(l => `<option>${l}</option>`).join('');
  const today = new Date().toISOString().slice(0, 10);

  return `
  <div class="page-header">
    <div class="page-title">Log a New Entry</div>
    <div class="page-sub">Submit a reading. Terra checks it against the IQR baseline and flags it if unusual.</div>
  </div>
  <div class="tip">💡 Try <strong>Hostel · Waste · 120 kg</strong> to trigger an alert, or <strong>Canteen · Waste · 15 kg</strong> for a normal result.</div>
  <div class="log-form">
    <div class="form-grid-3" style="margin-bottom:.8rem">
      <div class="fg"><label>Date</label><input type="date" id="l-date" value="${today}"></div>
      <div class="fg"><label>Module</label><select id="l-mod">${modOpts}</select></div>
      <div class="fg"><label>Location</label><select id="l-loc">${locOpts}</select></div>
    </div>
    <div class="form-grid-3" style="margin-bottom:.8rem">
      <div class="fg"><label>Value</label><input type="number" id="l-val" placeholder="e.g. 18.5" step="0.1" min="0"></div>
      <div class="fg"><label>Unit</label><select id="l-unit">
        <option value="kg">kg (waste)</option><option value="kWh">kWh (energy)</option>
        <option value="L">Litres (water)</option><option value="vehicles">Vehicles</option><option value="kg CO2">kg CO2</option>
      </select></div>
      <div class="fg"><label>Logged By</label><select id="l-col">
        <option>Housekeeping</option><option>Sanitation Staff</option><option>NGO Partner</option><option>Auto-meter</option><option>Student Volunteer</option>
      </select></div>
    </div>
    <button class="run-btn" onclick="checkLog()">▶ Run Anomaly Check</button>
    <div id="log-result" class="result-panel">
      <div class="rp-title" id="rp-title"></div>
      <div class="rp-nums" id="rp-nums"></div>
      <div class="rp-text" id="rp-text"></div>
    </div>
  </div>`;
}

function checkLog() {
  const val = parseFloat(document.getElementById('l-val').value);
  if (!val || val <= 0) { alert('Enter a valid value.'); return; }

  const mod = document.getElementById('l-mod').value;
  const loc = document.getElementById('l-loc').value;
  const unit = document.getElementById('l-unit').value;
  const col = document.getElementById('l-col').value;
  const date = document.getElementById('l-date').value;

  const modVals = getData().filter(d => d.module === mod).map(d => d.value);
  const iq = iqrThreshold(modVals);
  const panel = document.getElementById('log-result');
  const isFlagged = val > iq.threshold;

  panel.className = 'result-panel ' + (isFlagged ? 'flag' : 'ok');
  panel.style.display = 'block';
  document.getElementById('rp-title').innerHTML = isFlagged
    ? `<span style="color:var(--red)">⚠ Anomaly Detected — Alert Would Be Triggered</span>`
    : `<span style="color:var(--green)">✓ Normal Reading — No Alert</span>`;

  const pct = isFlagged
    ? ((val - iq.threshold) / iq.threshold * 100).toFixed(0)
    : ((iq.threshold - val) / iq.threshold * 100).toFixed(0);

  document.getElementById('rp-nums').innerHTML = `
    <div class="rp-num"><div class="v" style="color:${isFlagged ? 'var(--red)' : 'var(--green)'}">${val} ${unit}</div><div class="l">You entered</div></div>
    <div class="rp-num"><div class="v">${iq.threshold.toFixed(1)} ${unit}</div><div class="l">IQR threshold</div></div>
    <div class="rp-num"><div class="v" style="color:${isFlagged ? 'var(--red)' : 'var(--green)'}">${isFlagged ? '+' : '−'}${pct}%</div><div class="l">${isFlagged ? 'above' : 'below'} threshold</div></div>`;

  document.getElementById('rp-text').textContent = isFlagged
    ? `This value is ${pct}% above the normal range for ${loc} (Q3 + 1.5×IQR = ${iq.threshold.toFixed(1)}). Under your configured workflow, an alert would be sent via ${CONFIG.alertDel} with a ${CONFIG.sla}-day response window.`
    : `${val} ${unit} at ${loc} is within the expected range. The entry will be added to the dataset and used to update the baseline for future checks.`;

  if (isFlagged) return;
  newEntries.push({ date, location: loc, module: mod, metric: mod, value: val, unit, collector: col });
}
