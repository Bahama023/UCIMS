// ============================================================
// UCIMS — Admin Panel Page
// src/pages/AdminPanel.jsx
// ============================================================
import { useEffect, useState } from "react";
import { getReadings, deleteReading, getAdminUsers, updateAdminUser, uploadCSV } from "../services/api";

const ROLES = ["viewer", "analyst", "admin"];

function Badge({ text, color }) {
  const map = {
    admin:    "bg-purple-100 text-purple-700",
    analyst:  "bg-blue-100   text-blue-700",
    viewer:   "bg-gray-100   text-gray-600",
    active:   "bg-green-100  text-green-700",
    inactive: "bg-red-100    text-red-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || "bg-gray-100 text-gray-600"}`}>
      {text}
    </span>
  );
}

export default function AdminPanel() {
  const [tab,      setTab]      = useState("readings");
  const [readings, setReadings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [csvFile,  setCsvFile]  = useState(null);
  const [csvResult, setCsvResult] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  useEffect(() => {
    if (tab === "readings") {
      setLoading(true);
      getReadings({ limit: 50 }).then((d) => setReadings(d.readings || [])).finally(() => setLoading(false));
    }
    if (tab === "users") {
      setLoading(true);
      getAdminUsers().then(setUsers).finally(() => setLoading(false));
    }
  }, [tab]);

  const handleDeleteReading = async (id) => {
    if (!window.confirm("Delete this reading and its UCI result?")) return;
    await deleteReading(id);
    setReadings((prev) => prev.filter((r) => r._id !== id));
    setMsg("Reading deleted.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleRoleChange = async (userId, role) => {
    await updateAdminUser(userId, { role });
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    setMsg("User role updated.");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleToggleActive = async (user) => {
    await updateAdminUser(user._id, { isActive: !user.isActive });
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setLoading(true);
    const result = await uploadCSV(csvFile);
    setCsvResult(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Panel</h1>
      <p className="text-sm text-gray-500 mb-6">Manage data, users, and bulk imports.</p>

      {msg && (
        <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-6">
        {["readings", "users", "upload"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition ${
              tab === t
                ? "border-b-2 border-gray-900 text-gray-900 font-medium"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {t === "upload" ? "CSV Upload" : t}
          </button>
        ))}
      </div>

      {/* --- READINGS TAB --- */}
      {tab === "readings" && (
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pr-4">Zone</th>
                  <th className="pb-2 pr-4">Temp</th>
                  <th className="pb-2 pr-4">AQI</th>
                  <th className="pb-2 pr-4">Traffic</th>
                  <th className="pb-2 pr-4">Noise</th>
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{r.zoneName}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{r.parameters?.temperature}°C</td>
                    <td className="py-2.5 pr-4 text-gray-600">{r.parameters?.aqi}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{r.parameters?.traffic}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{r.parameters?.noise} dB</td>
                    <td className="py-2.5 pr-4">
                      <Badge text={r.source} color={r.source === "api" ? "analyst" : "viewer"} />
                    </td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">
                      {new Date(r.recordedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => handleDeleteReading(r._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- USERS TAB --- */}
      {tab === "users" && (
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Role</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Last login</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{u.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{u.email}</td>
                    <td className="py-2.5 pr-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge text={u.isActive ? "active" : "inactive"} color={u.isActive ? "active" : "inactive"} />
                    </td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className="text-xs text-gray-500 hover:text-gray-800"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- CSV UPLOAD TAB --- */}
      {tab === "upload" && (
        <div className="max-w-lg">
          <p className="text-sm text-gray-600 mb-4">
            Upload a CSV file to bulk-import environmental readings. Required columns:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-xs text-gray-600 mb-6">
            zone_name, temperature, humidity, aqi, traffic, noise, recorded_at
          </div>

          <label className="block mb-2 text-sm font-medium text-gray-700">Choose CSV file</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => { setCsvFile(e.target.files[0]); setCsvResult(null); }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-medium
              file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mb-4"
          />

          <button
            onClick={handleCsvUpload}
            disabled={!csvFile || loading}
            className="bg-emerald-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg
              hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? "Uploading…" : "Upload & Import"}
          </button>

          {csvResult && (
            <div className={`mt-5 rounded-lg p-4 text-sm border ${
              csvResult.failed > 0
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}>
              <p className="font-medium mb-1">Import complete</p>
              <p>✓ Imported: {csvResult.imported}</p>
              {csvResult.failed > 0 && <p>✗ Failed: {csvResult.failed}</p>}
              {csvResult.errors?.length > 0 && (
                <ul className="mt-2 text-xs list-disc list-inside">
                  {csvResult.errors.slice(0, 5).map((e, i) => (
                    <li key={i}>Row {e.row}: {e.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
