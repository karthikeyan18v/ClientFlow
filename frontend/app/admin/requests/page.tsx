"use client";
import { useEffect, useState } from "react";
import { getRequests, approveRequest, rejectRequest } from "@/lib/api";

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  PENDING: { background: "rgba(234,179,8,0.15)", color: "#fde047", border: "1px solid rgba(234,179,8,0.3)" },
  APPROVED: { background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" },
  REJECTED: { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" },
};
const STATUS_ICON: Record<string, string> = { PENDING: "🕐", APPROVED: "✅", REJECTED: "❌" };

export default function RequestsPage() {
  const [tab, setTab] = useState<"new" | "log">("new");
  const [requests, setRequests] = useState<any[]>([]);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => getRequests().then((r) => setRequests(r.data));
  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };
  const handleApprove = async (id: string) => { await approveRequest(id); load(); showToast("Request approved — project created"); };
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId) return;
    await rejectRequest(rejectId, reason);
    setRejectId(null); setReason(""); load();
    showToast("Request rejected");
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const processed = requests.filter((r) => r.status !== "PENDING");

  const tabBtn = (t: "new" | "log", label: string, count?: number) => (
    <button onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: tab === t ? "rgba(99,102,241,0.2)" : "transparent", color: tab === t ? "#a5b4fc" : "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600, cursor: "pointer", borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent" }}>
      {label}{count !== undefined ? <span style={{ marginLeft: "6px", fontSize: "11px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "1px 7px" }}>{count}</span> : null}
    </button>
  );

  return (
    <div style={{ color: "white" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Requests</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>Manage client project requests</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabBtn("new", "New Requests", pending.length)}
        {tabBtn("log", "All Requests", requests.length)}
      </div>

      {/* New Requests tab — pending only */}
      {tab === "new" && (
        <>
          {pending.length === 0 && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
              No pending requests
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pending.map((r) => (
              <div key={r._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ fontSize: "20px", marginTop: "2px" }}>🕐</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>{r.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{r.clientId?.name}{r.clientId?.companyName ? ` · ${r.clientId.companyName}` : ""}</p>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, flexShrink: 0, ...STATUS_STYLE.PENDING }}>PENDING</span>
                  </div>
                  {r.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 12px", lineHeight: 1.5 }}>{r.description}</p>}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>📅 {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleApprove(r._id)} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", color: "#86efac", fontSize: "12px", padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}>✓ Approve</button>
                      <button onClick={() => { setRejectId(r._id); setReason(""); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", color: "#fca5a5", fontSize: "12px", padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Requests log tab */}
      {tab === "log" && (
        <>
          {/* Summary */}
          {requests.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px", maxWidth: "500px" }}>
              {[{ label: "Pending", count: pending.length, s: STATUS_STYLE.PENDING }, { label: "Approved", count: requests.filter(r => r.status === "APPROVED").length, s: STATUS_STYLE.APPROVED }, { label: "Rejected", count: requests.filter(r => r.status === "REJECTED").length, s: STATUS_STYLE.REJECTED }].map(({ label, count, s }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: s.color as string }}>{count}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {requests.length === 0 && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>No requests yet</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {requests.map((r) => (
              <div key={r._id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ fontSize: "20px", marginTop: "2px" }}>{STATUS_ICON[r.status]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "4px" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>{r.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>{r.clientId?.name}{r.clientId?.companyName ? ` · ${r.clientId.companyName}` : ""}</p>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, flexShrink: 0, ...STATUS_STYLE[r.status] }}>{r.status}</span>
                  </div>
                  {r.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "6px 0 8px", lineHeight: 1.5 }}>{r.description}</p>}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>📅 {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {r.status === "APPROVED" && <span style={{ color: "#86efac", fontSize: "11px" }}>✓ Project created</span>}
                    {r.rejectionReason && <span style={{ color: "#fca5a5", fontSize: "11px" }}>Reason: {r.rejectionReason}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px" }}>
          <div style={{ background: "#13132a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", width: "100%", maxWidth: "400px", padding: "24px" }}>
            <h3 style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: "0 0 16px" }}>Reject Request</h3>
            <form onSubmit={handleReject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>Reason</label>
                <textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Enter rejection reason..."
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(239,68,68,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={() => setRejectId(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
