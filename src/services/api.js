// ============================================================
// UCIMS — API Service Layer
// src/services/api.js
// ============================================================

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("ucims_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

export const login  = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (payload) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const getMe = () => request("/auth/me");

export const getZones   = ()         => request("/zones");
export const createZone = (data)     => request("/zones", { method: "POST", body: JSON.stringify(data) });
export const updateZone = (id, data) => request(`/zones/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteZone = (id)       => request(`/zones/${id}`, { method: "DELETE" });

export const submitReading = (data) =>
  request("/readings", { method: "POST", body: JSON.stringify(data) });

export const getReadings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/readings?${qs}`);
};

export const deleteReading = (id) => request(`/readings/${id}`, { method: "DELETE" });

export const uploadCSV = (file) => {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  return fetch(`${BASE}/readings/upload-csv`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  }).then((r) => r.json());
};

export const getUCIResults = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/uci?${qs}`);
};
export const getLatestUCI = ()             => request("/uci/latest");
export const getUCIStats  = ()             => request("/uci/stats");
export const previewUCI   = (parameters)   =>
  request("/uci/compute", { method: "POST", body: JSON.stringify({ parameters }) });

export const downloadCSVReport = async (zoneId) => {
  const token = getToken();
  const qs    = zoneId ? `?zone=${zoneId}` : "";
  const res   = await fetch(`${BASE}/reports/csv${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "ucims_report.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const getAdminUsers   = ()          => request("/admin/users");
export const updateAdminUser = (id, data)  =>
  request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) });