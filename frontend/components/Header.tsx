"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";

export default function Header({ profileHref }: { profileHref: string }) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => { setUser(getUser()); }, []);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <header style={{ height: "60px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 24px", background: "#0d0d1f", flexShrink: 0, position: "relative", zIndex: 40 }}>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Avatar button */}
        <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "6px 12px 6px 6px", cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "white", fontSize: "13px", fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{user?.name || "User"}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", margin: 0 }}>{user?.role?.toLowerCase()}</p>
          </div>
          <svg style={{ marginLeft: "4px", color: "rgba(255,255,255,0.3)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: "220px", background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "8px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 50 }}>
            {/* User info */}
            <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "6px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <p style={{ color: "white", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{user?.name}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{user?.role?.toLowerCase()}</p>
            </div>

            {/* Profile link */}
            <button onClick={() => { router.push(profileHref); setOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              View Profile
            </button>

            {/* Sign out */}
            <button onClick={handleLogout}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", border: "none", background: "transparent", color: "rgba(239,68,68,0.7)", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#fca5a5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(239,68,68,0.7)"; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
