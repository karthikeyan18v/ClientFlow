"use client";
import { useEffect, useState } from "react";
import { updateClientProfile, getClientProfile } from "@/lib/api";

const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };

const FIELDS = [
  { key: "name", label: "Full Name", type: "text" },
  { key: "companyName", label: "Company Name", type: "text" },
  { key: "companyAddress", label: "Company Address", type: "text" },
  { key: "companyPhone", label: "Company Phone", type: "text" },
  { key: "companyWebsite", label: "Company Website", type: "text" },
  { key: "gstNumber", label: "GST Number", type: "text" },
  { key: "contactPerson", label: "Contact Person", type: "text" },
  { key: "password", label: "New Password", type: "password" },
];

const EMPTY = { name: "", companyName: "", companyAddress: "", companyPhone: "", companyWebsite: "", gstNumber: "", contactPerson: "", password: "" };

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getClientProfile().then((r) => {
      const u = r.data;
      setUser(u);
      setForm({ name: u.name || "", companyName: u.companyName || "", companyAddress: u.companyAddress || "", companyPhone: u.companyPhone || "", companyWebsite: u.companyWebsite || "", gstNumber: u.gstNumber || "", contactPerson: u.contactPerson || "", password: "" });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { ...form };
      if (!payload.password) delete payload.password;
      const r = await updateClientProfile(payload);
      setUser(r.data);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Profile</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>Manage your account</p>
      </div>
      <div style={{ maxWidth: "480px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 700, color: "white", flexShrink: 0, boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "16px", margin: "0 0 4px" }}>{user?.name}</p>
            <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "20px", background: "rgba(139,92,246,0.2)", color: "#c4b5fd", fontWeight: 600 }}>CLIENT</span>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "6px 0 0" }}>{user?.email}</p>
            {user?.companyName && <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", margin: "2px 0 0" }}>{user.companyName}</p>}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FIELDS.map(({ key, label, type }) => (
              <div key={key}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>{label}</label>
                <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={type === "password" ? "Leave blank to keep current" : ""}
                  style={inp} onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "4px" }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      {success && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", zIndex: 100 }}>✓ {success}</div>}
      <style>{`input::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
