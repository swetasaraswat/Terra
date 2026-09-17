// ══════════════════════════════════════════════════════════
// IQR ANOMALY DETECTION ENGINE
// ══════════════════════════════════════════════════════════

// Linear-interpolation percentile (standard "R-7" method)
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

function getData() {
  return [...BASE_DATA, ...newEntries];
}

function flagData() {
  const all = getData();
  // IQR is computed per module — mixing kg (waste), kWh (energy) and
  // litres (water) into one array would make the threshold meaningless
  // for every module except whichever had the most entries.
  const byMod = {};
  all.forEach(d => { (byMod[d.module] = byMod[d.module] || []).push(d.value); });

  const iqByMod = {};
  Object.keys(byMod).forEach(m => { iqByMod[m] = iqrThreshold(byMod[m]); });

  return all.map(d => {
    const iq = iqByMod[d.module];
    return { ...d, flagged: d.value > iq.threshold, threshold: iq.threshold, iq };
  });
}
