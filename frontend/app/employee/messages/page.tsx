"use client";
import MessagesView from "@/components/MessagesView";

export default function EmployeeMessagesPage() {
  return (
    <div style={{ color: "white" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Messages</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>Your conversations</p>
      </div>
      <MessagesView />
    </div>
  );
}
