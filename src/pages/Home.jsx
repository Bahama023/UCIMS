// ============================================================
// UCIMS — Home Page with India GIS Map
// src/pages/Home.jsx
// ============================================================
// Requires: npm install leaflet react-leaflet framer-motion
// Add to index.html:
//   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
// ============================================================
 
import { useEffect, useState, useRef } from "react";
import { NavLink }                      from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { motion, AnimatePresence }       from "framer-motion";
import { getLatestUCI, getUCIStats }     from "../services/api";
import "leaflet/dist/leaflet.css";
 
// ── City demo data (seeded from seed.js — mirrors those 20 cities) ──
const DEMO_CITIES = [
  { city:"Mumbai",        state:"Maharashtra",    lat:19.076, lng:72.878, avgUCI:54, zones:[
    {name:"Bandra",uci:62},{name:"Dharavi",uci:32},{name:"Nariman Point",uci:58},{name:"Powai",uci:67},{name:"Worli",uci:54}]},
  { city:"Delhi",         state:"Delhi",          lat:28.704, lng:77.103, avgUCI:38, zones:[
    {name:"Connaught Place",uci:46},{name:"Rohini",uci:55},{name:"Okhla",uci:22},{name:"Lutyens Zone",uci:74},{name:"Shahdara",uci:33}]},
  { city:"Bengaluru",     state:"Karnataka",      lat:12.972, lng:77.595, avgUCI:67, zones:[
    {name:"Koramangala",uci:72},{name:"Whitefield",uci:64},{name:"Peenya",uci:38},{name:"Indiranagar",uci:70}]},
  { city:"Chennai",       state:"Tamil Nadu",     lat:13.083, lng:80.271, avgUCI:59, zones:[
    {name:"Anna Nagar",uci:68},{name:"Guindy",uci:40},{name:"T. Nagar",uci:55},{name:"Adyar",uci:78}]},
  { city:"Hyderabad",     state:"Telangana",      lat:17.385, lng:78.487, avgUCI:61, zones:[
    {name:"HITEC City",uci:70},{name:"Charminar",uci:44},{name:"Uppal",uci:48},{name:"Jubilee Hills",uci:72}]},
  { city:"Pune",          state:"Maharashtra",    lat:18.520, lng:73.857, avgUCI:63, zones:[
    {name:"Hinjewadi",uci:68},{name:"Hadapsar",uci:45},{name:"Koregaon Park",uci:76}]},
  { city:"Ahmedabad",     state:"Gujarat",        lat:23.023, lng:72.571, avgUCI:55, zones:[
    {name:"Naroda",uci:32},{name:"SG Highway",uci:65},{name:"Bodakdev",uci:70}]},
  { city:"Kolkata",       state:"West Bengal",    lat:22.573, lng:88.364, avgUCI:44, zones:[
    {name:"Park Street",uci:55},{name:"Howrah",uci:30},{name:"Salt Lake",uci:66}]},
  { city:"Jaipur",        state:"Rajasthan",      lat:26.912, lng:75.787, avgUCI:50, zones:[
    {name:"Walled City",uci:42},{name:"Mansarovar",uci:62},{name:"Sitapura",uci:35}]},
  { city:"Lucknow",       state:"Uttar Pradesh",  lat:26.847, lng:80.946, avgUCI:47, zones:[
    {name:"Hazratganj",uci:55},{name:"Gomti Nagar",uci:60},{name:"Chinhat",uci:28}]},
  { city:"Raipur",        state:"Chhattisgarh",   lat:21.251, lng:81.630, avgUCI:58, zones:[
    {name:"Civil Lines",uci:68},{name:"Pandri",uci:61},{name:"Urla",uci:34},{name:"Shankar Nagar",uci:72}]},
  { city:"Bhopal",        state:"Madhya Pradesh", lat:23.260, lng:77.413, avgUCI:55, zones:[
    {name:"New Market",uci:62},{name:"Mandideep",uci:30},{name:"Arera Colony",uci:70}]},
  { city:"Nagpur",        state:"Maharashtra",    lat:21.146, lng:79.088, avgUCI:62, zones:[
    {name:"Sitabuldi",uci:60},{name:"Butibori",uci:35},{name:"Civil Lines",uci:82}]},
  { city:"Indore",        state:"Madhya Pradesh", lat:22.720, lng:75.858, avgUCI:65, zones:[
    {name:"Vijay Nagar",uci:72},{name:"Pithampur",uci:38},{name:"Rajwada",uci:58}]},
  { city:"Surat",         state:"Gujarat",        lat:21.170, lng:72.831, avgUCI:52, zones:[
    {name:"Hazira",uci:28},{name:"Vesu",uci:70},{name:"Ring Road",uci:60}]},
  { city:"Visakhapatnam", state:"Andhra Pradesh", lat:17.687, lng:83.219, avgUCI:60, zones:[
    {name:"Gajuwaka",uci:35},{name:"Rushikonda",uci:84},{name:"MVP Colony",uci:68}]},
  { city:"Chandigarh",    state:"Punjab",         lat:30.733, lng:76.779, avgUCI:70, zones:[
    {name:"Sector 17",uci:72},{name:"Industrial Area",uci:48},{name:"Sector 44",uci:78}]},
  { city:"Kochi",         state:"Kerala",         lat:9.931,  lng:76.267, avgUCI:72, zones:[
    {name:"Ernakulam",uci:68},{name:"Kalamassery",uci:52},{name:"Kakkanad",uci:80}]},
  { city:"Patna",         state:"Bihar",          lat:25.594, lng:85.138, avgUCI:36, zones:[
    {name:"Danapur",uci:40},{name:"Patna City",uci:30},{name:"Phulwari Sharif",uci:38}]},
  { city:"Coimbatore",    state:"Tamil Nadu",     lat:11.017, lng:76.956, avgUCI:64, zones:[
    {name:"Singanallur",uci:42},{name:"RS Puram",uci:75},{name:"Gandhipuram",uci:68}]},
];
 
// ── Colour helpers ──────────────────────────────────────────
function uciColor(score) {
  if (score >= 80) return { fill: "#22c55e", ring: "#16a34a33", label: "Very High", bg: "#dcfce7", text: "#15803d" };
  if (score >= 60) return { fill: "#10b981", ring: "#05966933", label: "High",      bg: "#d1fae5", text: "#065f46" };
  if (score >= 40) return { fill: "#f59e0b", ring: "#d9770633", label: "Moderate",  bg: "#fef3c7", text: "#92400e" };
  if (score >= 20) return { fill: "#ef4444", ring: "#dc262633", label: "Low",       bg: "#fee2e2", text: "#991b1b" };
  return               { fill: "#7f1d1d", ring: "#7f1d1d33", label: "Very Low",  bg: "#fecaca", text: "#7f1d1d" };
}
 
// ── Fit India on mount ──────────────────────────────────────
function FitIndia() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[6.5, 68.0], [35.5, 97.5]], { padding: [24, 24] });
  }, [map]);
  return null;
}
 
// ── City sidebar panel ──────────────────────────────────────
function CityPanel({ city, onClose }) {
  if (!city) return null;
  const c = uciColor(city.avgUCI);
  return (
    <AnimatePresence>
      <motion.div
        key="panel"
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        exit={{    x: 320, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className="absolute top-0 right-0 bottom-0 w-72 bg-white border-l border-gray-100 shadow-xl z-[1000] flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-50">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{city.state}</p>
            <h2 className="text-lg font-bold text-gray-900">{city.city}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 text-sm flex items-center justify-center mt-0.5">✕</button>
        </div>
 
        {/* Score */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-end gap-3 mb-3">
            <span className="text-5xl font-bold leading-none" style={{ color: c.fill }}>{city.avgUCI}</span>
            <div className="pb-1">
              <span className="text-xs text-gray-400 block mb-1">/ 100</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
                {c.label} Comfort
              </span>
            </div>
          </div>
          {/* Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${city.avgUCI}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: c.fill }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>0</span><span>100</span>
          </div>
        </div>
 
        {/* Zone breakdown */}
        <div className="p-5 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Zone Breakdown — {city.zones.length} zones
          </p>
          <div className="space-y-2.5">
            {city.zones.map((z) => {
              const zc = uciColor(z.uci);
              return (
                <div key={z.name} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: zc.fill }} />
                  <span className="flex-1 text-sm text-gray-600 truncate">{z.name}</span>
                  <span className="text-sm font-semibold" style={{ color: zc.fill }}>{z.uci}</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${z.uci}%`, background: zc.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* Footer CTA */}
        <div className="p-5 border-t border-gray-50">
          <NavLink to="/dashboard"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
            View Full Dashboard →
          </NavLink>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
 
// ── Stat card ───────────────────────────────────────────────
function StatCard({ val, label, color = "#fff" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
      <div className="text-2xl font-bold" style={{ color }}>{val}</div>
      <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}
 
// ── Main ────────────────────────────────────────────────────
export default function Home() {
  const [cities,   setCities]   = useState(DEMO_CITIES);
  const [stats,    setStats]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [live,     setLive]     = useState(false);
  const stripRef = useRef(null);
 
  // Try live API; fall back to demo
  useEffect(() => {
    Promise.all([getLatestUCI(), getUCIStats()])
      .then(([latest, s]) => {
        if (latest?.length > 0) {
          // Group results by city (zoneName format: "Zone Name" from seed)
          const cityMap = {};
          latest.forEach((z) => {
            const demo = DEMO_CITIES.find((d) =>
              d.zones.some((dz) => dz.name === z.zoneName)
            );
            const cityName = demo?.city || z.zoneName;
            if (!cityMap[cityName]) cityMap[cityName] = { zones: [], demo };
            cityMap[cityName].zones.push(z);
          });
          const liveCities = Object.entries(cityMap).map(([cityName, { zones, demo }]) => {
            const avg = parseFloat((zones.reduce((s, z) => s + z.uciScore, 0) / zones.length).toFixed(1));
            return {
              city:    cityName,
              state:   demo?.state || "",
              lat:     demo?.lat   || 20,
              lng:     demo?.lng   || 78,
              avgUCI:  avg,
              zones:   zones.map((z) => ({ name: z.zoneName, uci: z.uciScore })),
            };
          });
          if (liveCities.length >= 3) { setCities(liveCities); setLive(true); }
          setStats(s);
        }
      })
      .catch(() => {});
  }, []);
 
  const avg     = Math.round(cities.reduce((s, c) => s + c.avgUCI, 0) / cities.length);
  const best    = cities.reduce((a, b) => b.avgUCI > a.avgUCI ? b : a, cities[0]);
  const worst   = cities.reduce((a, b) => b.avgUCI < a.avgUCI ? b : a, cities[0]);
 
  const scrollStrip = (dir) => {
    if (stripRef.current) stripRef.current.scrollBy({ left: dir * 160, behavior: "smooth" });
  };
 
  return (
    <div className="bg-gray-950 text-white min-h-screen">
 
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-emerald-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot inline-block" />
            {live ? "Live data — connected to MongoDB" : "Final Year Thesis Project · 2024–25"}
          </div>
 
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Urban Comfort Index<br />
            <span className="text-emerald-400">Management System</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            A data-driven framework assessing zone-wise urban livability using a composite
            Environmental Comfort Index across {cities.length} Indian cities.
          </p>
 
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NavLink to="/calculate"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
              Compute UCI →
            </NavLink>
            <NavLink to="/dashboard"
              className="bg-white/8 hover:bg-white/12 border border-white/10 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors">
              View Dashboard
            </NavLink>
            <NavLink to="/about"
              className="text-gray-400 hover:text-white text-sm px-4 py-3 transition-colors">
              About the project
            </NavLink>
          </div>
        </motion.div>
      </section>
 
      {/* ── National stats ───────────────────────────────────── */}
      <section className="px-4 pb-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard val={avg}             label="Avg National UCI"    color="#10b981" />
          <StatCard val={cities.length}   label="Cities monitored"    color="#60a5fa" />
          <StatCard val={best?.city}      label="Best comfort city"   color="#22c55e" />
          <StatCard val={worst?.city}     label="Needs attention"     color="#f87171" />
        </div>
      </section>
 
      {/* ── India Map ────────────────────────────────────────── */}
      <section className="px-4 pb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white">India Urban Comfort Map</h2>
            <p className="text-xs text-gray-500 mt-0.5">Click any city marker to explore zone-wise UCI scores</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Very High
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block ml-1" />Moderate
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1" />Low
          </div>
        </div>
 
        <div className="relative rounded-2xl overflow-hidden border border-white/8" style={{ height: 500 }}>
          <MapContainer
            center={[22.5, 82.0]} zoom={5}
            style={{ width: "100%", height: "100%", background: "#0c1220" }}
            zoomControl={false}
            attributionControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
              maxZoom={18}
            />
            <FitIndia />
 
            {cities.map((city) => {
              const c   = uciColor(city.avgUCI);
              const sel = selected?.city === city.city;
              const r   = 8 + Math.min(city.zones.length * 1.5, 8);
 
              return (
                <CircleMarker
                  key={city.city}
                  center={[city.lat, city.lng]}
                  radius={sel ? r + 5 : r}
                  pathOptions={{
                    color:       sel ? "#fff" : c.fill,
                    fillColor:   c.fill,
                    fillOpacity: sel ? 1 : 0.8,
                    weight:      sel ? 2.5 : 1.5,
                  }}
                  eventHandlers={{ click: () => setSelected(city) }}
                >
                  <Popup>
                    <div style={{ fontFamily: "Inter, sans-serif", minWidth: 160 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{city.city}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{city.state}</p>
                      <span style={{
                        display: "inline-block",
                        background: c.bg, color: c.text,
                        padding: "3px 10px", borderRadius: 12,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        UCI {city.avgUCI} · {c.label}
                      </span>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                        {city.zones.length} zones · click marker for details
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
 
          {/* City detail sidebar */}
          <CityPanel city={selected} onClose={() => setSelected(null)} />
 
          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 bg-gray-950/90 border border-white/10 rounded-xl px-3 py-2.5 backdrop-blur z-[500] text-xs">
            <p className="text-gray-500 font-medium uppercase tracking-wider text-[10px] mb-2">Comfort Class</p>
            {[
              ["#22c55e", "Very High (80–100)"],
              ["#10b981", "High (60–79)"],
              ["#f59e0b", "Moderate (40–59)"],
              ["#ef4444", "Low (20–39)"],
              ["#7f1d1d", "Very Low (0–19)"],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* City strip */}
        <div className="relative mt-3">
          <button onClick={() => scrollStrip(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-gray-950 border border-white/10 rounded-lg text-gray-400 hover:text-white flex items-center justify-center">‹</button>
          <div ref={stripRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-9"
            style={{ scrollbarWidth: "none" }}>
            {[...cities].sort((a, b) => b.avgUCI - a.avgUCI).map((city) => {
              const c   = uciColor(city.avgUCI);
              const sel = selected?.city === city.city;
              return (
                <button
                  key={city.city}
                  onClick={() => setSelected(city)}
                  className={`flex-shrink-0 rounded-lg px-3 py-2 border transition-colors text-left ${
                    sel ? "border-white/25 bg-white/10" : "border-white/8 bg-white/4 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.fill }} />
                    <span className="text-xs font-medium text-white whitespace-nowrap">{city.city}</span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: c.fill }}>{city.avgUCI}</div>
                </button>
              );
            })}
          </div>
          <button onClick={() => scrollStrip(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-gray-950 border border-white/10 rounded-lg text-gray-400 hover:text-white flex items-center justify-center">›</button>
        </div>
      </section>
 
      {/* ── UCI Formula strip ─────────────────────────────────── */}
      <section className="px-4 pb-10 max-w-6xl mx-auto">
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">UCI Formula</p>
              <pre className="text-emerald-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
{`UCI = (0.15 × Temp) + (0.15 × Humidity)
    + (0.30 × AQI)  + (0.20 × Traffic)
    + (0.20 × Noise)`}
              </pre>
            </div>
            <div className="space-y-1.5 sm:min-w-[200px]">
              {[
                { label: "AQI",         pct: 30, color: "bg-emerald-500" },
                { label: "Traffic",     pct: 20, color: "bg-blue-400"    },
                { label: "Noise",       pct: 20, color: "bg-purple-400"  },
                { label: "Temperature", pct: 15, color: "bg-amber-400"   },
                { label: "Humidity",    pct: 15, color: "bg-cyan-400"    },
              ].map((w) => (
                <div key={w.label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-24 shrink-0">{w.label}</span>
                  <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.pct * 3.33}%` }} />
                  </div>
                  <span className="text-xs font-medium text-white w-7 text-right">{w.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* ── Features grid ────────────────────────────────────── */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Platform Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🗺", title: "India GIS Map",       desc: "Interactive zone-wise UCI map of 20+ Indian cities with color-coded comfort layers." },
            { icon: "📊", title: "Live Dashboard",       desc: "Bar, radar, and doughnut charts with zone filtering and CSV export." },
            { icon: "🧮", title: "UCI Calculator",       desc: "Enter environmental parameters and compute composite index in real time." },
            { icon: "📥", title: "CSV Bulk Import",      desc: "Upload zone datasets via CSV for batch UCI computation and storage." },
            { icon: "🔐", title: "Admin Panel",          desc: "Manage zones, users, readings and datasets with role-based access." },
            { icon: "📄", title: "Report Export",        desc: "Download UCI results as CSV or PDF for thesis and policy presentations." },
          ].map((f) => (
            <div key={f.title} className="bg-white/4 border border-white/8 rounded-xl p-5 hover:bg-white/6 transition-colors">
              <span className="text-2xl block mb-3">{f.icon}</span>
              <h3 className="font-semibold text-white mb-1.5 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      <style>{`
        .leaflet-container { background: #0c1220 !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>
    </div>
  );
}