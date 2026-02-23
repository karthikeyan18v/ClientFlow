"use client";
import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";
import { getUser } from "@/lib/auth";

const statusStyle: Record<string, React.CSSProperties> = {
  NOT_STARTED: { background: "rgba(148,163,184,0.1)", color: "rgba(148,163,184,0.9)", border: "1px solid rgba(148,163,184,0.2)" },
  IN_PROGRESS: { background: "rgba(59,130,246,0.1)", color: "rgba(96,165,250,0.9)", border: "1px solid rgba(59,130,246,0.2)" },
  ON_HOLD: { background: "rgba(245,158,11,0.1)", color: "rgba(251,191,36,0.9)", border: "1px solid rgba(245,158,11,0.2)" },
  COMPLETED: { background: "rgba(16,185,129,0.1)", color: "rgba(52,211,153,0.9)", border: "1px solid rgba(16,185,129,0.2)" },
};

const cards = [
  { key: "totalClients", label: "Total Clients", icon: "🏢", color: "#3b82f6", glow: "rgba(59,130,246,0.3)" },
  { key: "totalEmployees", label: "Employees", icon: "👤", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
  { key: "totalProjects", label: "Projects", icon: "📁", color: "#6366f1", glow: "rgba(99,102,241,0.3)" },
  { key: "pendingRequests", label: "Pending Requests", icon: "⏳", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const user = getUser();

  useEffect(() => { getDashboard().then((r) => setStats(r.data)); }, []);

  if (!stats) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ color: "white" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 4px" }}>Welcome back,</p>
        <h1 style={{ color: "white", fontSize: "26px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{user?.name || "Admin"}</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0 }}>Here's what's happening today</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {cards.map(({ key, label, icon, color, glow }) => (
          <div key={key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, boxShadow: `0 0 20px ${glow}` }}>
              {icon}
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 4px", fontWeight: 500 }}>{label}</p>
              <p style={{ color: "white", fontSize: "28px", fontWeight: 700, margin: 0, lineHeight: 1 }}>{stats[key] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Projects by status */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Projects by Status</p>
        {(!stats.projectsByStatus || stats.projectsByStatus.length === 0) && (
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No projects yet</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {stats.projectsByStatus?.map((s: any) => (
            <div key={s._id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, ...(statusStyle[s._id] || statusStyle.NOT_STARTED) }}>
              <span>{s._id?.replace(/_/g, " ")}</span>
              <span style={{ opacity: 0.7 }}>·</span>
              <span>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
