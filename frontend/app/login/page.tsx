"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setAuth } from "@/lib/auth";

const ROLES = ["ADMIN", "EMPLOYEE", "CLIENT"] as const;
type Role = typeof ROLES[number];

const ROLE_REDIRECT: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  EMPLOYEE: "/employee/projects",
  CLIENT: "/client/projects",
};

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" },
  orb1: { position: "absolute", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" },
  orb2: { position: "absolute", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  grid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" },
  wrap: { width: "100%", maxWidth: "420px", position: "relative", zIndex: 10 },
  logoBox: { textAlign: "center", marginBottom: "36px" },
  logoIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "18px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", marginBottom: "16px", boxShadow: "0 0 40px rgba(99,102,241,0.4)" },
  logoText: { color: "white", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px" },
  title: { color: "white", fontSize: "24px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)" },
  roleTabs: { display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "4px", marginBottom: "28px", gap: "4px" },
  label: { display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" },
  inputWrap: { position: "relative", marginBottom: "20px" },
  input: { width: "100%", paddingLeft: "42px", paddingRight: "16px", paddingTop: "13px", paddingBottom: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" as const },
  iconLeft: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4, pointerEvents: "none" as const },
  error: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#fca5a5", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" },
  btn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", color: "white", fontSize: "15px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 0 30px rgba(99,102,241,0.35)" },
  footer: { textAlign: "center" as const, color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "20px", lineHeight: 1.6 },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(email, password);
      const actualRole: Role = data.user.role;
      if (actualRole !== selectedRole) {
        setError(`This account is not a ${selectedRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }
      setAuth(data.token, data.user);
      router.push(ROLE_REDIRECT[actualRole]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.orb1} /><div style={s.orb2} /><div style={s.grid} />

      <div style={s.wrap}>
        <div style={s.logoBox}>
          <div style={s.logoIcon}><span style={s.logoText}>KSS</span></div>
          <h1 style={s.title}>Karthikeyan Software</h1>
          <p style={s.subtitle}>Sign in to your portal</p>
        </div>

        <div style={s.card}>
          {/* Role tabs */}
          <div style={s.roleTabs}>
            {ROLES.map((role) => (
              <button key={role} type="button" onClick={() => { setSelectedRole(role); setError(""); }}
                style={{ flex: 1, padding: "8px 4px", borderRadius: "9px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  background: selectedRole === role ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                  color: selectedRole === role ? "white" : "rgba(255,255,255,0.4)",
                  boxShadow: selectedRole === role ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
                }}>
                {role[0] + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <svg style={s.iconLeft} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={s.input}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>

            <div>
              <label style={s.label}>Password</label>
              <div style={{ ...s.inputWrap, marginBottom: "24px" }}>
                <svg style={s.iconLeft} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ ...s.input, paddingRight: "52px" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div style={s.error}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ ...s.btn, background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                <><svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in...</>
              ) : (
                <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </form>

          <p style={s.footer}>Authorized access only · Contact admin for credentials</p>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
