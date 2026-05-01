// ============================================================
// UCIMS — UCI Calculator Page
// src/pages/Calculator.jsx
// ============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { previewUCI, submitReading } from "../services/api";

const PARAMS = [
  { key: "temperature", label: "Temperature",     unit: "°C",      min: 0,   max: 60,   hint: "Comfortable: 18–26 °C",   step: 0.1 },
  { key: "humidity",    label: "Humidity",         unit: "%",       min: 0,   max: 100,  hint: "Comfortable: 40–60 %",    step: 1   },
  { key: "aqi",         label: "AQI",              unit: "",        min: 0,   max: 500,  hint: "Good ≤50 · Hazardous >300", step: 1 },
  { key: "traffic",     label: "Traffic Density",  unit: "veh/km",  min: 0,   max: 1000, hint: "Low <200 · High >600",    step: 1   },
  { key: "noise",       label: "Noise Level",      unit: "dB",      min: 30,  max: 120,  hint: "WHO safe: ≤55 dB",        step: 0.5 },
];

const CLASS_STYLES = {
  "Very High": { bg: "bg-green-100",  text: "text-green-800",  bar: "bg-green-500"  },
  "High":      { bg: "bg-emerald-100",text: "text-emerald-800",bar: "bg-emerald-500"},
  "Moderate":  { bg: "bg-amber-100",  text: "text-amber-800",  bar: "bg-amber-500"  },
  "Low":       { bg: "bg-orange-100", text: "text-orange-800", bar: "bg-orange-500" },
  "Very Low":  { bg: "bg-red-100",    text: "text-red-800",    bar: "bg-red-500"    },
};

const WEIGHTS = { temperature: "15%", humidity: "15%", aqi: "30%", traffic: "20%", noise: "20%" };

export default function Calculator({ zones = [] }) {
  const [form, setForm] = useState({
    zoneId:      "",
    temperature: 30,
    humidity:    60,
    aqi:         100,
    traffic:     400,
    noise:       65,
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: key === "zoneId" ? value : parseFloat(value) || 0 }));
    setResult(null);
    setSaved(false);
  };

  const handleCompute = async () => {
    setError("");
    setLoading(true);
    try {
      const { zoneId, ...parameters } = form;
      const data = await previewUCI(parameters);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.zoneId) { setError("Please select a zone to save the reading."); return; }
    setLoading(true);
    try {
      const { zoneId, ...parameters } = form;
      await submitReading({ zoneId, parameters });
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const style = result ? CLASS_STYLES[result.comfortClass] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">UCI Calculator</h1>
      <p className="text-sm text-gray-500 mb-8">
        Enter zone environmental data to compute the Urban Comfort Index.
      </p>

      {/* Zone selector */}
      {zones.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.zoneId}
            onChange={(e) => handleChange("zoneId", e.target.value)}
          >
            <option value="">— Select zone (optional for preview) —</option>
            {zones.map((z) => (
              <option key={z._id} value={z._id}>{z.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Parameter inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {PARAMS.map((p) => (
          <div key={p.key} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-800">{p.label}</label>
              <span className="text-xs text-gray-400">{WEIGHTS[p.key]} weight</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={p.min} max={p.max} step={p.step}
                value={form[p.key]}
                onChange={(e) => handleChange(p.key, e.target.value)}
                className="flex-1 accent-emerald-500"
              />
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  min={p.min} max={p.max} step={p.step}
                  value={form[p.key]}
                  onChange={(e) => handleChange(p.key, e.target.value)}
                  className="w-16 border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">{p.unit}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{p.hint}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCompute}
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Computing…" : "Compute UCI"}
        </button>
        {result && (
          <button
            onClick={handleSave}
            disabled={loading || saved}
            className="px-6 border border-emerald-600 text-emerald-700 text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-50 transition disabled:opacity-60"
          >
            {saved ? "✓ Saved" : "Save reading"}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 rounded-2xl p-6 border ${style.bg} border-transparent`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Urban Comfort Index</p>
                <p className="text-5xl font-bold text-gray-900">{result.uciScore}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
                  {result.comfortClass} Comfort
                </span>
              </div>
              {/* Score bar */}
              <div className="flex-1 sm:max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>0</span><span>100</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.uciScore}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${style.bar}`}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{result.uciScore} / 100</p>
              </div>
            </div>

            {/* Parameter breakdown */}
            <div className="grid grid-cols-5 gap-2">
              {PARAMS.map((p) => (
                <div key={p.key} className="bg-white/70 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{p.label.split(" ")[0]}</p>
                  <p className={`text-lg font-bold ${style.text}`}>
                    {result.normalized[p.key]}
                  </p>
                  <p className="text-xs text-gray-400">norm</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ×{WEIGHTS[p.key]} = {result.weighted[p.key]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
