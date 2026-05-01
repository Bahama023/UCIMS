// ============================================================
// UCIMS — Dashboard Page
// src/pages/Dashboard.jsx
// ============================================================
import { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut, Radar, Line } from "react-chartjs-2";
import { getLatestUCI, getUCIStats, downloadCSVReport } from "../services/api";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
);

const CLASS_COLOR = {
  "Very High": "#22c55e",
  "High":      "#10b981",
  "Moderate":  "#f59e0b",
  "Low":       "#f97316",
  "Very Low":  "#ef4444",
};

function uciColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#10b981";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

function StatCard({ label, value, sub, color = "text-gray-900" }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [latest, setLatest] = useState([]);
  const [stats,  setStats]  = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLatestUCI(), getUCIStats()])
      .then(([l, s]) => { setLatest(l); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading dashboard…
      </div>
    );
  }

  const filtered = filter === "all"
    ? latest
    : latest.filter((z) => z.comfortClass === filter);

  // Bar chart data
  const barData = {
    labels:   filtered.map((z) => z.zoneName),
    datasets: [{
      label:           "UCI Score",
      data:            filtered.map((z) => z.uciScore),
      backgroundColor: filtered.map((z) => uciColor(z.uciScore)),
      borderRadius:    6,
    }],
  };

  // Doughnut data
  const classDist = stats?.classDist || {};
  const doughnutData = {
    labels:   Object.keys(classDist),
    datasets: [{
      data:            Object.values(classDist),
      backgroundColor: Object.keys(classDist).map((k) => CLASS_COLOR[k]),
      borderWidth:     2,
      borderColor:     "#fff",
    }],
  };

  // Radar — top 3 zones by UCI
  const top3 = [...latest].sort((a, b) => b.uciScore - a.uciScore).slice(0, 3);
  const radarParams = ["temperature", "humidity", "aqi", "traffic", "noise"];
  const radarColors = ["rgba(16,185,129,.7)", "rgba(59,130,246,.7)", "rgba(249,115,22,.7)"];
  const radarData = {
    labels: ["Temperature", "Humidity", "AQI", "Traffic", "Noise"],
    datasets: top3.map((z, i) => ({
      label:           z.zoneName,
      data:            radarParams.map((p) => z.normalized?.[p] ?? 0),
      borderColor:     radarColors[i],
      backgroundColor: radarColors[i].replace(".7", ".12"),
      pointBackgroundColor: radarColors[i],
    })),
  };

  const bestZone  = latest.reduce((a, b) => (b.uciScore > a.uciScore ? b : a), latest[0] || {});
  const worstZone = latest.reduce((a, b) => (b.uciScore < a.uciScore ? b : a), latest[0] || {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">City-wide urban comfort overview</p>
        </div>
        <button
          onClick={() => downloadCSVReport()}
          className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="City Avg UCI" value={stats?.avgUCI ?? "—"} color="text-emerald-600" />
        <StatCard label="Best Zone"  value={bestZone?.zoneName  ?? "—"} sub={`UCI ${bestZone?.uciScore}`}  />
        <StatCard label="Worst Zone" value={worstZone?.zoneName ?? "—"} sub={`UCI ${worstZone?.uciScore}`} />
        <StatCard label="Zones monitored" value={latest.length} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", "Very High", "High", "Moderate", "Low", "Very Low"].map((cls) => (
          <button
            key={cls}
            onClick={() => setFilter(cls)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              filter === cls
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cls === "all" ? "All zones" : cls}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-4">Zone-wise UCI scores</p>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { min: 0, max: 100, ticks: { font: { size: 11 } } } },
            }}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-4">Comfort class distribution</p>
          <div className="max-w-[220px] mx-auto">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                cutout: "58%",
                plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Parameter radar — top 3 zones</p>
        <div className="max-w-[360px] mx-auto">
          <Radar
            data={radarData}
            options={{
              responsive: true,
              scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, font: { size: 10 } } } },
              plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
            }}
          />
        </div>
      </div>

      {/* Zone comparison table */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm overflow-x-auto">
        <p className="text-sm font-medium text-gray-700 mb-4">Zone comparison table</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2 pr-4">Zone</th>
              <th className="pb-2 pr-4">UCI</th>
              <th className="pb-2 pr-4">Class</th>
              <th className="pb-2 pr-4">Temp°C</th>
              <th className="pb-2 pr-4">AQI</th>
              <th className="pb-2 pr-4">Traffic</th>
              <th className="pb-2">Noise dB</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((z) => (
              <tr key={z.zoneId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-2.5 pr-4 font-medium text-gray-800">{z.zoneName}</td>
                <td className="py-2.5 pr-4 font-bold" style={{ color: uciColor(z.uciScore) }}>
                  {z.uciScore}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: `${CLASS_COLOR[z.comfortClass]}22`,
                      color: CLASS_COLOR[z.comfortClass],
                    }}
                  >
                    {z.comfortClass}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-gray-600">{z.reading?.parameters?.temperature ?? "—"}</td>
                <td className="py-2.5 pr-4 text-gray-600">{z.reading?.parameters?.aqi       ?? "—"}</td>
                <td className="py-2.5 pr-4 text-gray-600">{z.reading?.parameters?.traffic   ?? "—"}</td>
                <td className="py-2.5 text-gray-600">{z.reading?.parameters?.noise      ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
