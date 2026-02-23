"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const items = [
  { label: "My Projects", href: "/client/projects", icon: "📁" },
  { label: "Requests", href: "/client/services", icon: "📋" },
  { label: "Messages", href: "/client/messages", icon: "💬" },
  { label: "Profile", href: "/client/profile", icon: "👤" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
      <Sidebar items={items} role="Client" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header profileHref="/client/profile" />
        <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
