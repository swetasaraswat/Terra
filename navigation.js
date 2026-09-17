// ══════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════
function buildModNav() {
  const colors = { waste:'#6FCF97', energy:'#F2C94C', water:'#56CCF2', transport:'#BB6BD9', green:'#6FCF97', carbon:'#EB5757' };
  const labels = { waste:'🗑️ Waste', energy:'⚡ Energy', water:'💧 Water', transport:'🚌 Transport', green:'🌱 Green Space', carbon:'🌫️ Carbon' };
  document.getElementById('mod-nav').innerHTML = CONFIG.modules.map(m => `
    <div class="module-nav" onclick="filterByModule('${m}')">
      <div class="mod-dot" style="background:${colors[m] || '#6FCF97'}"></div>
      ${labels[m] || m}
    </div>`).join('');
}

function filterByModule(mod) {
  showView('data', null);
  setTimeout(() => {
    document.getElementById('fmod').value = mod;
    renderTable();
  }, 50);
}

function showView(v, el) {
  currentView = v;
  if (el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  const mc = document.getElementById('main-content');
  Object.values(charts).forEach(c => c.destroy());
  charts = {};

  if (v === 'dashboard') { mc.innerHTML = dashboardHTML(); initDashboard(); }
  else if (v === 'alerts') { mc.innerHTML = alertsHTML(); }
  else if (v === 'log') { mc.innerHTML = logHTML(); }
  else if (v === 'esg') { mc.innerHTML = esgHTML(); }
  else if (v === 'data') { mc.innerHTML = dataHTML(); renderTable(); }
  else if (v === 'report') { mc.innerHTML = reportHTML(); }
}
