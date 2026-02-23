"use client";
import { useEffect, useRef, useState } from "react";
import { getAdminProjects, createAdminProject, updateAdminProject, deleteAdminProject, getAdminClients, getAdminEmployees, assignEmployees } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

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

const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "board">("board");
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [assignModal, setAssignModal] = useState<any>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", clientId: "", status: "NOT_STARTED" });
  const [success, setSuccess] = useState("");
  const dragId = useRef<string | null>(null);

  const load = () => getAdminProjects().then((r) => setProjects(r.data));
  useEffect(() => { load(); getAdminClients().then((r) => setClients(r.data)); getAdminEmployees().then((r) => setEmployees(r.data)); }, []);

  const showToast = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };
  const openCreate = () => { setEditProject(null); setForm({ name: "", description: "", clientId: "", status: "NOT_STARTED" }); setShowModal(true); };
  const openEdit = (p: any) => { setEditProject(p); setForm({ name: p.name, description: p.description, clientId: p.clientId?._id, status: p.status }); setShowModal(true); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) await updateAdminProject(editProject._id, form); else await createAdminProject(form);
    setShowModal(false); load(); showToast(editProject ? "Project updated" : "Project created");
  };
  const openAssign = (p: any) => { setAssignModal(p); setSelectedEmployees(p.employeeIds?.map((e: any) => e._id) || []); };
  const handleAssign = async () => { await assignEmployees(assignModal._id, selectedEmployees); setAssignModal(null); load(); showToast("Employees assigned"); };
  const toggleEmployee = (id: string) => setSelectedEmployees((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  // Drag handlers
  const onDragStart = (id: string) => { dragId.current = id; };
  const onDrop = async (status: string) => {
    if (!dragId.current) return;
    const p = projects.find((x) => x._id === dragId.current);
    if (!p || p.status === status) { dragId.current = null; return; }
    setProjects((prev) => prev.map((x) => x._id === dragId.current ? { ...x, status } : x));
    await updateAdminProject(dragId.current, { status });
    dragId.current = null;
    showToast("Status updated");
  };

  const modalStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px" };
  const cardStyle: React.CSSProperties = { background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", width: "100%", maxWidth: "440px", overflow: "hidden" };
  const headerStyle: React.CSSProperties = { padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" };

  return (
    <div style={{ color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Projects</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>{projects.length} total</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["board", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: view === v ? "rgba(99,102,241,0.2)" : "transparent", color: view === v ? "#a5b4fc" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
          ))}
          <button onClick={openCreate} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>+ New Project</button>
        </div>
      </div>

      {/* BOARD VIEW */}
      {view === "board" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", alignItems: "start" }}>
          {COLUMNS.map((col) => {
            const colProjects = projects.filter((p) => p.status === col.key);
            return (
              <div key={col.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(col.key)}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "12px", minHeight: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.color }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "1px 8px", color: "rgba(255,255,255,0.4)" }}>{colProjects.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {colProjects.map((p) => (
                    <div key={p._id} draggable
                      onDragStart={() => onDragStart(p._id)}
                      style={{ background: "#13132a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px", cursor: "grab", transition: "box-shadow 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                      <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 6px", color: "white" }}>{p.name}</p>
                      {p.description && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "0 0 10px", lineHeight: 1.4 }}>{p.description}</p>}
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: "0 0 10px" }}>{p.clientId?.companyName || p.clientId?.name || "No client"}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "-6px" }}>
                          {(p.employeeIds || []).slice(0, 3).map((emp: any, i: number) => (
                            <div key={emp._id} title={emp.name} style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "white", border: "2px solid #13132a", marginLeft: i > 0 ? "-6px" : 0 }}>
                              {emp.name?.[0]?.toUpperCase()}
                            </div>
                          ))}
                          {p.employeeIds?.length > 3 && <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "rgba(255,255,255,0.5)", border: "2px solid #13132a", marginLeft: "-6px" }}>+{p.employeeIds.length - 3}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button onClick={() => openAssign(p)} title="Assign" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "6px", color: "#a5b4fc", fontSize: "11px", padding: "3px 8px", cursor: "pointer" }}>👤</button>
                          <button onClick={() => openEdit(p)} title="Edit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontSize: "11px", padding: "3px 8px", cursor: "pointer" }}>✏</button>
                          <button onClick={() => setConfirmId(p._id)} title="Delete" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#fca5a5", fontSize: "11px", padding: "3px 8px", cursor: "pointer" }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colProjects.length === 0 && <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>Drop here</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Project", "Client", "Status", "Employees", "Date", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)" }}>No projects yet</td></tr>}
              {projects.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{p.description}</p>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.5)" }}>{p.clientId?.companyName || p.clientId?.name || "—"}</td>
                  <td style={{ padding: "14px 16px" }}><span style={{ ...statusStyle[p.status], padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{p.status.replace(/_/g, " ")}</span></td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.5)" }}>{p.employeeIds?.length || 0}</td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.35)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => openAssign(p)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)", color: "#a5b4fc", fontSize: "12px", cursor: "pointer" }}>Assign</button>
                      <button onClick={() => openEdit(p)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => setConfirmId(p._id)} style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "12px", cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project modal */}
      {showModal && (
        <div style={modalStyle}>
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3 style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>{editProject ? "Edit Project" : "New Project"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[{ key: "name", label: "Name", type: "text" }, { key: "description", label: "Description", type: "textarea" }].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{label}</label>
                  {type === "textarea"
                    ? <textarea value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    : <input required type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inp} onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />}
                </div>
              ))}
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Client</label>
                <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} style={inp}>
                  <option value="" style={{ background: "#13132a" }}>Select client</option>
                  {clients.map((c) => <option key={c._id} value={c._id} style={{ background: "#13132a" }}>{c.companyName || c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inp}>
                  {COLUMNS.map((c) => <option key={c.key} value={c.key} style={{ background: "#13132a" }}>{c.label}</option>)}
                </select>
              </div>
              <button type="submit" style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                {editProject ? "Update" : "Create"} Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assign modal */}
      {assignModal && (
        <div style={modalStyle}>
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3 style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>Assign Employees</h3>
              <button onClick={() => setAssignModal(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "16px 24px", maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
              {employees.map((e) => (
                <label key={e._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", background: selectedEmployees.includes(e._id) ? "rgba(99,102,241,0.1)" : "transparent", border: `1px solid ${selectedEmployees.includes(e._id) ? "rgba(99,102,241,0.3)" : "transparent"}` }}>
                  <input type="checkbox" checked={selectedEmployees.includes(e._id)} onChange={() => toggleEmployee(e._id)} style={{ accentColor: "#6366f1" }} />
                  <div>
                    <p style={{ color: "white", fontSize: "13px", fontWeight: 500, margin: 0 }}>{e.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{e.designation || e.department || "Employee"}</p>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={handleAssign} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Save Assignment</button>
            </div>
          </div>
        </div>
      )}

      {confirmId && <ConfirmDialog message="This will permanently delete the project." onConfirm={async () => { await deleteAdminProject(confirmId); setConfirmId(null); load(); showToast("Project deleted"); }} onCancel={() => setConfirmId(null)} />}
      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
