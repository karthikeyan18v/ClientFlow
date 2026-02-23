"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout, getUser } from "@/lib/auth";

interface NavItem { label: string; href: string; icon: string }

const ROLE_ICONS: Record<string, string> = { Admin: "⬡", Employee: "◈", Client: "◉" };

export default function Sidebar({ items, role }: { items: NavItem[]; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  useEffect(() => { setUser(getUser()); }, []);
  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <aside style={{ width: "240px", minHeight: "100vh", background: "#0d0d1f", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.3)", flexShrink: 0 }}>KSS</div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "14px", margin: 0 }}>KSS Portal</p>
            <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "20px", background: "rgba(99,102,241,0.2)", color: "rgba(139,92,246,0.9)", fontWeight: 600 }}>{role}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: 500, transition: "all 0.15s",
              background: active ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))" : "transparent",
              color: active ? "white" : "rgba(255,255,255,0.45)",
              borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
            }}>
              <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "4px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "white", fontSize: "13px", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "User"}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>{role}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
