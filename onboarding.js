// ══════════════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════════════
function toggleMod(el) {
  el.classList.toggle('selected');
}

function goStep2Next() {
  const modCount = document.querySelectorAll('#step-2 .module-chip.selected').length;
  if (modCount < 1) {
    alert('Select at least 1 module to track before continuing.');
    return;
  }
  goStep(3);
}

function goStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById('step-' + i).style.display = i === n ? 'block' : 'none';
    document.getElementById('dot-' + i).className = 'ob-dot' + (i < n ? ' done' : i === n ? ' active' : '');
  });
}

function launchApp() {
  const name    = document.getElementById('s1-name').value.trim() || 'My Campus';
  const city    = document.getElementById('s1-city').value.trim() || 'India';
  const type    = document.getElementById('s1-type').value;
  const size    = document.getElementById('s1-size').value;
  const hostel  = document.getElementById('s1-hostel').value;
  const role    = document.getElementById('s1-role').value;
  const sla     = document.getElementById('s2-sla').value;
  const alertDel = document.getElementById('s2-alert').value;
  const mods = [...document.querySelectorAll('#step-2 .module-chip.selected')].map(e => e.dataset.mod);
  const locs = [...document.querySelectorAll('#step-3 .module-chip.selected')].map(e => e.dataset.loc);
  const custom = document.getElementById('s3-custom').value.trim();
  if (custom) locs.push(custom);

  CONFIG = {
    name, city, type, size, hostel, role, sla, alertDel,
    modules: mods,
    locations: locs.length ? locs : ['Hostel', 'Canteen', 'Academic Block'],
  };

  document.getElementById('tb-campus').textContent = name;
  document.getElementById('tb-city').textContent = city;
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  buildModNav();
  showView('dashboard', document.querySelector('.nav-item'));
}

function resetApp() {
  CONFIG = {};
  respondedAlerts = new Set();
  newEntries = [];
  Object.values(charts).forEach(c => c.destroy());
  charts = {};
  document.getElementById('app').style.display = 'none';
  document.getElementById('onboarding').style.display = 'flex';
  goStep(1);
}
