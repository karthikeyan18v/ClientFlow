"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const items = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Employees", href: "/admin/employees", icon: "👷" },
  { label: "Clients", href: "/admin/clients", icon: "🏢" },
  { label: "Projects", href: "/admin/projects", icon: "📁" },
  { label: "Requests", href: "/admin/requests", icon: "📋" },
  { label: "Messages", href: "/admin/messages", icon: "💬" },
  { label: "Profile", href: "/admin/profile", icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
      <Sidebar items={items} role="Admin" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header profileHref="/admin/profile" />
        <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
