"use client";
import { useEffect, useState } from "react";
import { getAdminEmployees, createUser, deleteUser } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const FIELDS = [
  { key: "name", label: "Full Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "password", label: "Password", type: "password", required: true },
  { key: "phone", label: "Phone", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "designation", label: "Designation", type: "text" },
];

const EMPTY = { name: "", email: "", password: "", phone: "", department: "", designation: "" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => getAdminEmployees().then((r) => setEmployees(r.data));
  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const handleDelete = async () => {
    if (!confirmId) return;
    await deleteUser(confirmId);
    setConfirmId(null); load();
    showToast("Employee deleted successfully");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await createUser({ ...form, role: "EMPLOYEE" });
      setShowModal(false); setForm(EMPTY); load();
      showToast("Employee created successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Employees</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>{employees.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
          + Add Employee
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Name", "Email", "Department", "Designation", "Employee ID", ""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)" }}>No employees yet</td></tr>
            )}
            {employees.map((e) => (
              <tr key={e._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>{e.name[0]?.toUpperCase()}</div>
                    <span style={{ fontWeight: 500 }}>{e.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.45)" }}>{e.email}</td>
                <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.45)" }}>{e.department || "—"}</td>
                <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.45)" }}>{e.designation || "—"}</td>
                <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.45)" }}>{e.employeeId || "—"}</td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => setConfirmId(e._id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#fca5a5", fontSize: "12px", padding: "4px 10px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px" }}>
          <div style={{ background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", width: "100%", maxWidth: "440px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>Add Employee</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "60vh", overflowY: "auto" }}>
              {FIELDS.map(({ key, label, type, required }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{label}{required && <span style={{ color: "#f87171" }}> *</span>}</label>
                  <input type={type} required={required} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inp}
                    onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "4px" }}>
                {loading ? "Creating..." : "Create Employee"}
              </button>
              {error && <p style={{ color: "#fca5a5", fontSize: "13px", margin: "4px 0 0" }}>{error}</p>}
            </form>
          </div>
        </div>
      )}
      {confirmId && <ConfirmDialog message="This will permanently delete the employee." onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />}
      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`input::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
