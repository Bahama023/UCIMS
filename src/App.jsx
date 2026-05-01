import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login      from "./pages/Login";
import Home       from "./pages/Home";
import About      from "./pages/About";
import Calculator from "./pages/Calculator";
import Dashboard  from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Contact    from "./pages/Contact";

function Protected({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl flex flex-col p-6 gap-1">
        <button onClick={onClose} className="self-end text-gray-400 text-xl mb-4">✕</button>
        {[
          { to: "/",          label: "Home"      },
          { to: "/about",     label: "About"     },
          { to: "/calculate", label: "Calculate" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/contact",   label: "Contact"   },
          ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
        ].map((l) => (
          <NavLink key={l.to} to={l.to} onClick={onClose}
            className={({ isActive }) =>
              `text-sm px-4 py-2.5 rounded-lg ${isActive ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`
            }>{l.label}</NavLink>
        ))}
        <div className="mt-auto border-t border-gray-100 pt-4">
          {user
            ? <button onClick={() => { logout(); onClose(); }} className="w-full text-sm text-red-500 text-left px-4 py-2">Sign out</button>
            : <NavLink to="/login" onClick={onClose} className="block w-full text-center bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg">Sign in</NavLink>
          }
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";
  return (
    <>
      <header className={`sticky top-0 z-40 border-b transition-colors ${isHome ? "bg-gray-950/95 border-gray-800 backdrop-blur-md" : "bg-white border-gray-100"}`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" fill="white" opacity="0.9"/>
                <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.2" opacity="0.5"/>
              </svg>
            </div>
            <span className={`font-semibold text-sm ${isHome ? "text-white" : "text-gray-900"}`}>UCIMS</span>
          </NavLink>
          <nav className="hidden lg:flex items-center gap-0.5">
            {[
              { to: "/",          label: "Home"      },
              { to: "/about",     label: "About"     },
              { to: "/calculate", label: "Calculate" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/contact",   label: "Contact"   },
              ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
            ].map((l) => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) =>
                  `text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    isHome
                      ? isActive ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:text-white hover:bg-white/8"
                      : isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`
                }>{l.label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <span className={`text-xs ${isHome ? "text-gray-500" : "text-gray-400"}`}>{user.name}</span>
                <button onClick={logout} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${isHome ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>Sign out</button>
              </div>
            ) : (
              <NavLink to="/login" className={`hidden lg:inline-flex text-xs font-medium px-3 py-1.5 rounded-lg ${isHome ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>Sign in</NavLink>
            )}
            <button onClick={() => setMenuOpen(true)} className={`lg:hidden p-1.5 rounded-lg ${isHome ? "text-gray-300 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="5" x2="16" y2="5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13" x2="16" y2="13"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Nav />
          <main>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/about"     element={<About />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/contact"   element={<Contact />} />
              <Route path="/calculate" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin"     element={<Protected adminOnly><AdminPanel /></Protected>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}