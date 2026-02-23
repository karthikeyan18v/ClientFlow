"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const items = [
  { label: "My Projects", href: "/employee/projects", icon: "📁" },
  { label: "Messages", href: "/employee/messages", icon: "💬" },
  { label: "Profile", href: "/employee/profile", icon: "👤" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a1a" }}>
      <Sidebar items={items} role="Employee" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header profileHref="/employee/profile" />
        <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
