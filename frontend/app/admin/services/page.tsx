"use client";
import { useEffect, useState } from "react";
import { getServices, createService, deleteService } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => getServices().then((r) => setServices(r.data));
  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await createService(form);
      setShowModal(false); setForm({ name: "", description: "" }); load();
      showToast("Service created successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    await deleteService(confirmId);
    setConfirmId(null); load();
    showToast("Service deleted successfully");
  };

  return (
    <div style={{ color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Services</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>{services.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
          + Add Service
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {services.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", gridColumn: "1/-1", textAlign: "center", padding: "40px 0" }}>No services yet</p>
        )}
        {services.map((s) => (
          <div key={s._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>⚙</div>
              <button onClick={() => setConfirmId(s._id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#fca5a5", fontSize: "12px", padding: "4px 10px", cursor: "pointer", flexShrink: 0 }}>Delete</button>
            </div>
            <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>{s.name}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>{s.description || "—"}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px" }}>
          <div style={{ background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", width: "100%", maxWidth: "440px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>Add Service</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Name <span style={{ color: "#f87171" }}>*</span></label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inp}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ ...inp, resize: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              {error && <p style={{ color: "#fca5a5", fontSize: "13px", margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating..." : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmId && <ConfirmDialog message="This will permanently delete the service." onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />}
      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
