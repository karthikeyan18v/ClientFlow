"use client";
import { useEffect, useRef, useState } from "react";
import { getInbox, getConversation, sendMessage, getContacts } from "@/lib/api";
import { getUser } from "@/lib/auth";

const ROLE_COLOR: Record<string, React.CSSProperties> = {
  ADMIN: { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" },
  EMPLOYEE: { background: "rgba(139,92,246,0.2)", color: "#c4b5fd" },
  CLIENT: { background: "rgba(168,85,247,0.2)", color: "#d8b4fe" },
};

const Avatar = ({ name, size = 34 }: { name?: string; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "white", flexShrink: 0 }}>
    {name?.[0]?.toUpperCase()}
  </div>
);

export default function MessagesView() {
  const [inbox, setInbox] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState<any>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMe(getUser());
    getInbox().then((r) => setInbox(r.data));
    getContacts().then((r) => setContacts(r.data));
  }, []);

  useEffect(() => {
    if (!selected) return;
    getConversation(selected._id).then((r) => {
      setMessages(r.data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
  }, [selected]);

  const getPartner = (msg: any) => msg.senderId?._id === me?.id ? msg.receiverId : msg.senderId;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;
    await sendMessage(selected._id, text.trim());
    setText("");
    getInbox().then((r) => setInbox(r.data));
    getConversation(selected._id).then((r) => {
      setMessages(r.data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
  };

  const startChat = (contact: any) => { setSelected(contact); setShowContacts(false); setSearch(""); };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 180px)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Conversations</p>
          <button onClick={() => { setShowContacts(!showContacts); setSearch(""); }} title="New chat"
            style={{ background: showContacts ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "6px", color: "#a5b4fc", fontSize: "16px", width: "26px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
        </div>
        {/* Search bar */}
        <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <input value={search} onChange={(e) => { setSearch(e.target.value); if (e.target.value) setShowContacts(true); }} placeholder="Search contacts..."
            style={{ width: "100%", padding: "7px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "white", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Contact picker */}
          {showContacts && (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", padding: "8px 16px 4px", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>New chat</p>
              {contacts.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase())).length === 0 && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", padding: "12px 16px" }}>No contacts found</p>}
              {contacts.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase())).map((c) => (
                <button key={c._id} onClick={() => startChat(c)}
                  style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Avatar name={c.name} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "white", fontSize: "13px", fontWeight: 500, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "20px", fontWeight: 600, ...ROLE_COLOR[c.role] }}>{c.role}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Inbox */}
          {!showContacts && inbox.filter((msg) => {
            const partner = getPartner(msg);
            return partner?.name?.toLowerCase().includes(search.toLowerCase());
          }).length === 0 && !search && (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", padding: "24px", textAlign: "center" }}>No conversations yet.<br />Click + to start one.</p>
          )}
          {!showContacts && inbox.filter((msg) => {
            const partner = getPartner(msg);
            return partner?.name?.toLowerCase().includes(search.toLowerCase());
          }).map((msg) => {
            const partner = getPartner(msg);
            const active = selected?._id === partner?._id;
            return (
              <button key={msg._id} onClick={() => { setSelected(partner); setShowContacts(false); }}
                style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderTop: "none", borderRight: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", borderLeft: active ? "2px solid #6366f1" : "2px solid transparent", background: active ? "rgba(99,102,241,0.15)" : "transparent", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar name={partner?.name} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "white", fontSize: "13px", fontWeight: 500, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{partner?.name}</p>
                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "20px", fontWeight: 600, ...ROLE_COLOR[partner?.role] }}>{partner?.role}</span>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "6px 0 0 44px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.content}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", gap: "12px" }}>
            <span style={{ fontSize: "40px" }}>💬</span>
            <p style={{ fontSize: "13px", margin: 0 }}>Select a conversation or click + to start one</p>
          </div>
        ) : (
          <>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar name={selected.name} />
              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 600, margin: "0 0 2px" }}>{selected.name}</p>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "20px", fontWeight: 600, ...ROLE_COLOR[selected.role] }}>{selected.role}</span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((m) => {
                const senderId = m.senderId?._id ?? m.senderId;
                const isMe = String(senderId) === String(me?.id);
                return (
                  <div key={m._id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}>
                    {!isMe && <Avatar name={selected?.name} size={26} />}
                    <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isMe ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)", color: "white", fontSize: "13px" }}>
                      <p style={{ margin: "0 0 4px" }}>{m.content}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: isMe ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", textAlign: isMe ? "right" : "left" }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {isMe && <Avatar name={me?.name} size={26} />}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..."
                style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              <button type="submit" style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
