// ============================================================
// UCIMS — Contact Page
// src/pages/Contact.jsx
// ============================================================
import { useState } from "react";

export default function Contact() {
  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — wire to backend POST /api/contact if needed
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  const info = [
    { icon: "🏛", label: "Institution",   value: "University Name, City, State" },
    { icon: "📚", label: "Department",    value: "Computer Science & Engineering" },
    { icon: "🎓", label: "Programme",     value: "B.Tech Final Year, 2024–25"    },
    { icon: "📧", label: "Email",         value: "ucims@university.edu.in"       },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact & Feedback</h1>
        <p className="text-gray-500 text-sm">Get in touch with the UCIMS project team or submit feedback about the platform.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Contact form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Send a message</h2>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">Message sent!</p>
              <p className="text-sm text-gray-400">We'll get back to you soon.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name",    label: "Your name",    type: "text",  placeholder: "Priya Sharma"          },
                { key: "email",   label: "Email address", type: "email", placeholder: "you@example.com"       },
                { key: "subject", label: "Subject",       type: "text",  placeholder: "Feedback on Dashboard"  },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type} required
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      placeholder:text-gray-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  required rows={4}
                  value={form.message}
                  placeholder="Your message here…"
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    placeholder:text-gray-300"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium
                  py-2.5 rounded-xl transition-colors disabled:opacity-60">
                {loading ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Project info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Project information</h2>
            <div className="space-y-3">
              {info.map((i) => (
                <div key={i.label} className="flex items-start gap-3">
                  <span className="text-lg w-7 shrink-0">{i.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{i.label}</p>
                    <p className="text-sm text-gray-700">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team cards */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Team</h2>
            <div className="space-y-3">
              {[
                { name: "Student Name",  role: "Developer & Researcher", email: "student@university.edu" },
                { name: "Guide Name",    role: "Project Guide",           email: "guide@university.edu"   },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.role} · {m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub placeholder */}
          <div className="bg-gray-950 rounded-2xl p-5 text-center">
            <p className="text-gray-400 text-sm mb-3">Source code & documentation</p>
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
