"use client";
import { useEffect, useState } from "react";
import { getMyRequests, createClientRequest } from "@/lib/api";

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  PENDING: { background: "rgba(234,179,8,0.15)", color: "#fde047", border: "1px solid rgba(234,179,8,0.3)" },
  APPROVED: { background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" },
  REJECTED: { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" },
};

const STATUS_ICON: Record<string, string> = { PENDING: "🕐", APPROVED: "✅", REJECTED: "❌" };

const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };

export default function ClientRequestsPage() {
  const [tab, setTab] = useState<"new" | "log">("new");
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = () => getMyRequests().then((r) => setRequests(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await createClientRequest(form);
      setForm({ title: "", description: "" });
      load();
      setSuccess("Request submitted successfully");
      setTimeout(() => setSuccess(""), 3000);
      setTab("log");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const approved = requests.filter((r) => r.status === "APPROVED");
  const rejected = requests.filter((r) => r.status === "REJECTED");

  const tabBtn = (t: "new" | "log", label: string, count?: number) => (
    <button onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: tab === t ? "rgba(99,102,241,0.2)" : "transparent", color: tab === t ? "#a5b4fc" : "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600, cursor: "pointer", borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent" }}>
      {label}{count !== undefined ? <span style={{ marginLeft: "6px", fontSize: "11px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "1px 7px" }}>{count}</span> : null}
    </button>
  );

  return (
    <div style={{ color: "white" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Requests</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>Submit and track your project requests</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0" }}>
        {tabBtn("new", "New Request")}
        {tabBtn("log", "My Requests", requests.length)}
      </div>

      {/* New Request tab */}
      {tab === "new" && (
        <div style={{ maxWidth: "560px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Title <span style={{ color: "#f87171" }}>*</span></label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Website Redesign" style={inp}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe what you need..."
                  style={{ ...inp, resize: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              {error && <p style={{ color: "#fca5a5", fontSize: "13px", margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* My Requests log tab */}
      {tab === "log" && (
        <div style={{ maxWidth: "680px" }}>
          {requests.length === 0 && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
              No requests yet. <button onClick={() => setTab("new")} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}>Submit your first request</button>
            </div>
          )}

          {/* Summary stats */}
          {requests.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {[{ label: "Pending", count: pending.length, style: STATUS_STYLE.PENDING }, { label: "Approved", count: approved.length, style: STATUS_STYLE.APPROVED }, { label: "Rejected", count: rejected.length, style: STATUS_STYLE.REJECTED }].map(({ label, count, style }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px", ...style, background: "none", border: "none", padding: 0 }}>{count}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Request cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {requests.map((r) => (
              <div key={r._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ fontSize: "20px", marginTop: "2px" }}>{STATUS_ICON[r.status]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
                    <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>{r.title}</p>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, flexShrink: 0, ...STATUS_STYLE[r.status] }}>{r.status}</span>
                  </div>
                  {r.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px", lineHeight: 1.5 }}>{r.description}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>📅 {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {r.status === "APPROVED" && <span style={{ color: "#86efac", fontSize: "11px" }}>✓ Project has been created for this request</span>}
                    {r.rejectionReason && <span style={{ color: "#fca5a5", fontSize: "11px" }}>Reason: {r.rejectionReason}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
