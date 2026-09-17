// ══════════════════════════════════════════════════════════
// GLOBAL STATE
// ══════════════════════════════════════════════════════════
let CONFIG = {};
let charts = {};
let respondedAlerts = new Set();
let newEntries = [];
let currentView = 'dashboard';

// Sample dataset — realistic for any mid-size campus
const BASE_DATA = [
  {date:"2026-05-01",location:"Hostel",module:"waste",metric:"Waste Collected",value:14.0,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-01",location:"Canteen",module:"waste",metric:"Waste Collected",value:16.8,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-03",location:"Academic Block",module:"waste",metric:"Waste Collected",value:9.1,unit:"kg",collector:"Sanitation Staff"},
  {date:"2026-05-04",location:"Library",module:"waste",metric:"Waste Collected",value:7.8,unit:"kg",collector:"NGO Partner"},
  {date:"2026-05-05",location:"Hostel",module:"waste",metric:"Waste Collected",value:18.7,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-06",location:"Canteen",module:"waste",metric:"Waste Collected",value:21.3,unit:"kg",collector:"NGO Partner"},
  {date:"2026-05-07",location:"Academic Block",module:"waste",metric:"Waste Collected",value:12.7,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-08",location:"Hostel",module:"waste",metric:"Waste Collected",value:15.4,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-11",location:"Library",module:"waste",metric:"Waste Collected",value:6.5,unit:"kg",collector:"Sanitation Staff"},
  {date:"2026-05-12",location:"Canteen",module:"waste",metric:"Waste Collected",value:19.7,unit:"kg",collector:"NGO Partner"},
  {date:"2026-05-14",location:"Hostel",module:"waste",metric:"Waste Collected",value:16.4,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-15",location:"Academic Block",module:"waste",metric:"Waste Collected",value:11.1,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-16",location:"Canteen",module:"waste",metric:"Waste Collected",value:17.1,unit:"kg",collector:"Sanitation Staff"},
  {date:"2026-05-18",location:"Hostel",module:"waste",metric:"Waste Collected",value:9.4,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-19",location:"Library",module:"waste",metric:"Waste Collected",value:8.1,unit:"kg",collector:"NGO Partner"},
  {date:"2026-05-20",location:"Academic Block",module:"waste",metric:"Waste Collected",value:13.1,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-21",location:"Hostel",module:"waste",metric:"Waste Collected",value:20.9,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-24",location:"Canteen",module:"waste",metric:"Waste Collected",value:16.2,unit:"kg",collector:"Sanitation Staff"},
  {date:"2026-05-26",location:"Hostel",module:"waste",metric:"Waste Collected",value:142.0,unit:"kg",collector:"NGO Partner"},
  {date:"2026-05-28",location:"Academic Block",module:"waste",metric:"Waste Collected",value:10.2,unit:"kg",collector:"Housekeeping"},
  {date:"2026-05-30",location:"Canteen",module:"waste",metric:"Waste Collected",value:14.3,unit:"kg",collector:"NGO Partner"},
  {date:"2026-06-01",location:"Hostel",module:"waste",metric:"Waste Collected",value:11.0,unit:"kg",collector:"Housekeeping"},
  {date:"2026-06-03",location:"Library",module:"waste",metric:"Waste Collected",value:7.6,unit:"kg",collector:"NGO Partner"},
  {date:"2026-06-04",location:"Academic Block",module:"waste",metric:"Waste Collected",value:9.8,unit:"kg",collector:"Housekeeping"},
  {date:"2026-06-07",location:"Hostel",module:"waste",metric:"Waste Collected",value:12.2,unit:"kg",collector:"Sanitation Staff"},
  {date:"2026-06-10",location:"Canteen",module:"waste",metric:"Waste Collected",value:15.8,unit:"kg",collector:"Housekeeping"},
  {date:"2026-06-11",location:"Hostel",module:"waste",metric:"Waste Collected",value:14.3,unit:"kg",collector:"NGO Partner"},
  {date:"2026-06-12",location:"Library",module:"waste",metric:"Waste Collected",value:8.4,unit:"kg",collector:"Housekeeping"},
  {date:"2026-06-14",location:"Academic Block",module:"waste",metric:"Waste Collected",value:11.6,unit:"kg",collector:"NGO Partner"},
  // Energy (kWh)
  {date:"2026-05-01",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:142,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-05-08",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:138,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-05-15",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:155,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-05-22",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:247,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-05-29",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:140,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-06-05",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:151,unit:"kWh",collector:"Auto-meter"},
  {date:"2026-06-12",location:"Academic Block",module:"energy",metric:"Energy Consumed",value:162,unit:"kWh",collector:"Auto-meter"},
  // Water (litres)
  {date:"2026-05-01",location:"Hostel",module:"water",metric:"Water Used",value:3200,unit:"L",collector:"Manual log"},
  {date:"2026-05-08",location:"Hostel",module:"water",metric:"Water Used",value:3050,unit:"L",collector:"Manual log"},
  {date:"2026-05-15",location:"Hostel",module:"water",metric:"Water Used",value:3400,unit:"L",collector:"Manual log"},
  {date:"2026-05-22",location:"Hostel",module:"water",metric:"Water Used",value:3180,unit:"L",collector:"Manual log"},
  {date:"2026-05-29",location:"Hostel",module:"water",metric:"Water Used",value:3600,unit:"L",collector:"Manual log"},
  {date:"2026-06-05",location:"Hostel",module:"water",metric:"Water Used",value:3250,unit:"L",collector:"Manual log"},
  {date:"2026-06-12",location:"Hostel",module:"water",metric:"Water Used",value:3100,unit:"L",collector:"Manual log"},
];
