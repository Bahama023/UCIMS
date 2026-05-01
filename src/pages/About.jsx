// ============================================================
// UCIMS — About Page
// src/pages/About.jsx
// ============================================================
export default function About() {
  const team = [
    { name: "Student Name",       role: "Developer & Researcher", initials: "SN" },
    { name: "Guide Name",         role: "Project Guide",          initials: "GN" },
    { name: "Co-guide Name",      role: "Co-guide",               initials: "CG" },
  ];

  const params = [
    { key: "Temperature", weight: "15%", unit: "°C",     range: "0–60",   icon: "🌡", impact: "Heat stress affects comfort, productivity, and health." },
    { key: "Humidity",    weight: "15%", unit: "%",      range: "0–100",  icon: "💧", impact: "High humidity increases discomfort and disease risk." },
    { key: "AQI",         weight: "30%", unit: "index",  range: "0–500",  icon: "🌫", impact: "Air quality is the single strongest predictor of urban livability." },
    { key: "Traffic",     weight: "20%", unit: "veh/km", range: "0–1000", icon: "🚗", impact: "Congestion raises noise, pollution, and travel stress." },
    { key: "Noise",       weight: "20%", unit: "dB",     range: "30–120", icon: "🔊", impact: "Chronic noise exposure causes cardiovascular and cognitive harm." },
  ];

  const timeline = [
    { phase: "Phase 1", label: "Literature Review",       desc: "Study existing livability indices, smart city frameworks, and sensor datasets." },
    { phase: "Phase 2", label: "Framework Design",        desc: "Define parameters, normalization method, and weighting strategy using AHP." },
    { phase: "Phase 3", label: "Data Collection",         desc: "Gather zone-wise environmental data from government APIs and manual surveys." },
    { phase: "Phase 4", label: "Platform Development",    desc: "Build the full-stack UCIMS web application with dashboard and maps." },
    { phase: "Phase 5", label: "Analysis & Validation",   desc: "Compute UCI for all zones, validate against ground truth, derive insights." },
    { phase: "Phase 6", label: "Thesis Submission",       desc: "Document findings, present recommendations, submit final thesis report." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-100 mb-4">
          Final Year Thesis — Computer Science & Engineering
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          Urban Comfort Index<br />Management System
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          A data-driven framework for assessing and visualizing urban livability using a composite
          Environmental Comfort Index derived from five key parameters across city zones.
        </p>
      </div>

      {/* UCI Formula */}
      <div className="bg-gray-950 rounded-2xl p-6 mb-8">
        <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-3">UCI Formula</p>
        <pre className="text-emerald-300 font-mono text-sm leading-loose whitespace-pre-wrap">
{`UCI = (0.15 × Temperature_normalized)
    + (0.15 × Humidity_normalized)
    + (0.30 × AQI_normalized)
    + (0.20 × Traffic_normalized)
    + (0.20 × Noise_normalized)`}
        </pre>
        <p className="text-gray-500 text-xs mt-3">All parameters normalized to 0–100 (inverted: higher = more comfortable). Score range: 0–100.</p>
      </div>

      {/* Parameters */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Parameters</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {params.map((p) => (
          <div key={p.key} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{p.icon}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{p.weight}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{p.key}</h3>
            <p className="text-xs text-gray-400 mb-2">Unit: {p.unit} · Range: {p.range}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{p.impact}</p>
          </div>
        ))}
      </div>

      {/* Comfort Classification */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comfort Classification</h2>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-10">
        {[
          { cls: "Very High", range: "80–100", bar: "w-full",    color: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-800" },
          { cls: "High",      range: "60–79",  bar: "w-4/5",     color: "bg-emerald-400", bg: "bg-emerald-50",  text: "text-emerald-700" },
          { cls: "Moderate",  range: "40–59",  bar: "w-3/5",     color: "bg-amber-400",   bg: "bg-amber-50",    text: "text-amber-800"   },
          { cls: "Low",       range: "20–39",  bar: "w-2/5",     color: "bg-orange-400",  bg: "bg-orange-50",   text: "text-orange-800"  },
          { cls: "Very Low",  range: "0–19",   bar: "w-1/5",     color: "bg-red-400",     bg: "bg-red-50",      text: "text-red-800"     },
        ].map((r, i) => (
          <div key={r.cls} className={`flex items-center gap-4 px-5 py-3.5 ${i < 4 ? "border-b border-gray-50" : ""}`}>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.bg} ${r.text} w-24 text-center`}>{r.cls}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${r.bar} ${r.color} rounded-full`} />
            </div>
            <span className="text-xs text-gray-400 font-mono w-14 text-right">{r.range}</span>
          </div>
        ))}
      </div>

      {/* Methodology timeline */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Methodology</h2>
      <div className="relative mb-10">
        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gray-200" />
        <div className="space-y-4">
          {timeline.map((t, i) => (
            <div key={t.phase} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 relative z-10 shadow">
                {i + 1}
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex-1 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-600 font-medium">{t.phase}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm font-semibold text-gray-900">{t.label}</span>
                </div>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          {
            layer: "Frontend",
            color: "text-blue-600 bg-blue-50 border-blue-100",
            items: ["React.js 18", "Tailwind CSS", "Chart.js + react-chartjs-2", "Leaflet / react-leaflet (GIS maps)", "Framer Motion", "React Router v6"],
          },
          {
            layer: "Backend",
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
            items: ["Node.js + Express", "REST API architecture", "JWT Authentication", "Multer (CSV upload)", "json2csv (report export)"],
          },
          {
            layer: "Database",
            color: "text-green-600 bg-green-50 border-green-100",
            items: ["MongoDB Atlas", "Mongoose ODM", "5 schemas: Zone, Reading, UCI, User, CSVUpload", "Indexed queries for performance"],
          },
          {
            layer: "DevOps & Tools",
            color: "text-purple-600 bg-purple-50 border-purple-100",
            items: ["Vite (dev server & bundler)", "dotenv (environment config)", "bcryptjs (password hashing)", "CORS, nodemon"],
          },
        ].map((s) => (
          <div key={s.layer} className={`bg-white border rounded-xl p-5 shadow-sm`}>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color} inline-block mb-3`}>{s.layer}</span>
            <ul className="space-y-1.5">
              {s.items.map((it) => (
                <li key={it} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Team */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Team</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {team.map((m) => (
          <div key={m.name} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center mx-auto mb-3">
              {m.initials}
            </div>
            <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
            <p className="text-xs text-gray-400 mt-1">{m.role}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-6 text-center">
        Department of Computer Science & Engineering · University Name · Batch 2021–2025
      </p>
    </div>
  );
}