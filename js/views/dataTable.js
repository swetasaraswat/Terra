// ══════════════════════════════════════════════════════════
// RAW DATA TABLE VIEW
// ══════════════════════════════════════════════════════════
function dataHTML() {
  const modOpts = CONFIG.modules.map(m => `<option value="${m}">${m}</option>`).join('');
  const locOpts = CONFIG.locations.map(l => `<option value="${l}">${l}</option>`).join('');

  return `
  <div class="page-header">
    <div class="page-title">Raw Data</div>
    <div class="page-sub">${getData().length} records · Add entries via Log Entry · Flagged rows highlighted</div>
  </div>
  <div class="filter-bar">
    <select id="fmod" onchange="renderTable()"><option value="">All Modules</option>${modOpts}</select>
    <select id="floc" onchange="renderTable()"><option value="">All Locations</option>${locOpts}</select>
    <select id="fflag" onchange="renderTable()">
      <option value="">All Entries</option><option value="1">Anomalies Only</option><option value="0">Normal Only</option>
    </select>
  </div>
  <div class="tbl-wrap"><table>
    <thead><tr><th>#</th><th>Date</th><th>Module</th><th>Location</th><th>Metric</th><th>Value</th><th>Unit</th><th>Logged By</th><th>AI Flag</th></tr></thead>
    <tbody id="dtbody"></tbody>
  </table></div>`;
}

function renderTable() {
  const fmod = document.getElementById('fmod')?.value || '';
  const floc = document.getElementById('floc')?.value || '';
  const fflag = document.getElementById('fflag')?.value || '';

  const d = flagData().filter(x =>
    (!fmod || x.module === fmod) &&
    (!floc || x.location === floc) &&
    (fflag === '' || (fflag === '1' ? x.flagged : !x.flagged))
  );

  document.getElementById('dtbody').innerHTML = d.length ? d.map((r, i) => `
    <tr class="${r.flagged ? 'row-flag' : ''}">
      <td style="color:var(--muted)">${i + 1}</td>
      <td>${r.date}</td><td style="text-transform:capitalize">${r.module}</td>
      <td>${r.location}</td><td>${r.metric}</td>
      <td class="td-mono" style="color:${r.flagged ? 'var(--red)' : 'inherit'}">${r.value}</td>
      <td style="color:var(--muted)">${r.unit}</td>
      <td style="color:var(--muted)">${r.collector}</td>
      <td class="${r.flagged ? 'td-flag' : 'td-ok'}">${r.flagged ? '⚠ FLAGGED' : '✓'}</td>
    </tr>`).join('') : `<tr><td colspan="9"><div class="empty">No entries match these filters.</div></td></tr>`;
}
