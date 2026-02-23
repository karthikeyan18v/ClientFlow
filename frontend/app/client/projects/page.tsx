"use client";
import { useEffect, useState } from "react";
import { getClientProjects } from "@/lib/api";

const COLUMNS = [
  { key: "NOT_STARTED", label: "Not Started", color: "#94a3b8" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#60a5fa" },
  { key: "ON_HOLD", label: "On Hold", color: "#fbbf24" },
  { key: "COMPLETED", label: "Completed", color: "#34d399" },
];

const statusStyle: Record<string, React.CSSProperties> = {
  NOT_STARTED: { background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" },
  IN_PROGRESS: { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" },
  ON_HOLD: { background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" },
  COMPLETED: { background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" },
};

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [view, setView] = useState<"board" | "list">("board");

  useEffect(() => { getClientProjects().then((r) => setProjects(r.data)); }, []);

  return (
    <div style={{ color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>My Projects</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>{projects.length} total</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["board", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: view === v ? "rgba(99,102,241,0.2)" : "transparent", color: view === v ? "#a5b4fc" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
          ))}
        </div>
      </div>

      {projects.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📁</div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", margin: 0 }}>No projects yet</p>
        </div>
      )}

      {/* BOARD VIEW */}
      {view === "board" && projects.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", alignItems: "start" }}>
          {COLUMNS.map((col) => {
            const colProjects = projects.filter((p) => p.status === col.key);
            return (
              <div key={col.key} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "12px", minHeight: "160px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.color }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "1px 8px", color: "rgba(255,255,255,0.4)" }}>{colProjects.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {colProjects.map((p) => (
                    <div key={p._id} style={{ background: "#13132a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                      <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 4px", color: "white" }}>{p.name}</p>
                      {p.description && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "0 0 10px", lineHeight: 1.4 }}>{p.description}</p>}
                      {(p.employeeIds?.length > 0) && (
                        <div style={{ display: "flex" }}>
                          {p.employeeIds.slice(0, 4).map((emp: any, i: number) => (
                            <div key={emp._id} title={emp.name} style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "white", border: "2px solid #13132a", marginLeft: i > 0 ? "-6px" : 0 }}>
                              {emp.name?.[0]?.toUpperCase()}
                            </div>
                          ))}
                          {p.employeeIds.length > 4 && <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "rgba(255,255,255,0.5)", border: "2px solid #13132a", marginLeft: "-6px" }}>+{p.employeeIds.length - 4}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                  {colProjects.length === 0 && <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "16px 0" }}>—</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && projects.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Project", "Status", "Team", "Date"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{p.description}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ ...statusStyle[p.status], padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{p.status.replace(/_/g, " ")}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {p.employeeIds?.map((e: any) => (
                        <div key={e._id} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "3px 10px 3px 5px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: "white" }}>{e.name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontSize: "11px", color: "#a5b4fc" }}>{e.name}</span>
                        </div>
                      ))}
                      {!p.employeeIds?.length && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>—</span>}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.35)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
